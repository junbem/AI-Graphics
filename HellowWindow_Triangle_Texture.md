## HellowWindow 소스코드 및 설명
```
//*********************************************************
//
// Copyright (c) Microsoft. All rights reserved.
// This code is licensed under the MIT License (MIT).
// THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY
// IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
// PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
//
//*********************************************************

#include "stdafx.h"
#include "D3D12HelloWindow.h"

D3D12HelloWindow::D3D12HelloWindow(UINT width, UINT height, std::wstring name) :
    DXSample(width, height, name),
    m_frameIndex(0),
    m_rtvDescriptorSize(0)
{
}

void D3D12HelloWindow::OnInit()
{
    LoadPipeline();
    LoadAssets();
}

// Load the rendering pipeline dependencies.
void D3D12HelloWindow::LoadPipeline()
{
    UINT dxgiFactoryFlags = 0;

#if defined(_DEBUG)
    // Enable the debug layer (requires the Graphics Tools "optional feature").
    // NOTE: Enabling the debug layer after device creation will invalidate the active device.
    {
        ComPtr<ID3D12Debug> debugController;
        if (SUCCEEDED(D3D12GetDebugInterface(IID_PPV_ARGS(&debugController))))
        {
            debugController->EnableDebugLayer();

            // Enable additional debug layers.
            dxgiFactoryFlags |= DXGI_CREATE_FACTORY_DEBUG;
        }
    }
#endif

    ComPtr<IDXGIFactory4> factory;
    ThrowIfFailed(CreateDXGIFactory2(dxgiFactoryFlags, IID_PPV_ARGS(&factory)));

    if (m_useWarpDevice)
    {
        ComPtr<IDXGIAdapter> warpAdapter;
        ThrowIfFailed(factory->EnumWarpAdapter(IID_PPV_ARGS(&warpAdapter)));

        ThrowIfFailed(D3D12CreateDevice(
            warpAdapter.Get(),
            D3D_FEATURE_LEVEL_11_0,
            IID_PPV_ARGS(&m_device)
            ));
    }
    else
    {
        ComPtr<IDXGIAdapter1> hardwareAdapter;
        GetHardwareAdapter(factory.Get(), &hardwareAdapter);

        ThrowIfFailed(D3D12CreateDevice(
            hardwareAdapter.Get(),
            D3D_FEATURE_LEVEL_11_0,
            IID_PPV_ARGS(&m_device)
            ));
    }

    // Describe and create the command queue.
    D3D12_COMMAND_QUEUE_DESC queueDesc = {};
    queueDesc.Flags = D3D12_COMMAND_QUEUE_FLAG_NONE;
    queueDesc.Type = D3D12_COMMAND_LIST_TYPE_DIRECT;

    ThrowIfFailed(m_device->CreateCommandQueue(&queueDesc, IID_PPV_ARGS(&m_commandQueue)));

    // Describe and create the swap chain.
    DXGI_SWAP_CHAIN_DESC1 swapChainDesc = {};
    swapChainDesc.BufferCount = FrameCount;
    swapChainDesc.Width = m_width;
    swapChainDesc.Height = m_height;
    swapChainDesc.Format = DXGI_FORMAT_R8G8B8A8_UNORM;
    swapChainDesc.BufferUsage = DXGI_USAGE_RENDER_TARGET_OUTPUT;
    swapChainDesc.SwapEffect = DXGI_SWAP_EFFECT_FLIP_DISCARD;
    swapChainDesc.SampleDesc.Count = 1;

    ComPtr<IDXGISwapChain1> swapChain;
    ThrowIfFailed(factory->CreateSwapChainForHwnd(
        m_commandQueue.Get(),        // Swap chain needs the queue so that it can force a flush on it.
        Win32Application::GetHwnd(),
        &swapChainDesc,
        nullptr,
        nullptr,
        &swapChain
        ));

    // This sample does not support fullscreen transitions.
    ThrowIfFailed(factory->MakeWindowAssociation(Win32Application::GetHwnd(), DXGI_MWA_NO_ALT_ENTER));

    ThrowIfFailed(swapChain.As(&m_swapChain));
    m_frameIndex = m_swapChain->GetCurrentBackBufferIndex();

    // Create descriptor heaps.
    {
        // Describe and create a render target view (RTV) descriptor heap.
        D3D12_DESCRIPTOR_HEAP_DESC rtvHeapDesc = {};
        rtvHeapDesc.NumDescriptors = FrameCount;
        rtvHeapDesc.Type = D3D12_DESCRIPTOR_HEAP_TYPE_RTV;
        rtvHeapDesc.Flags = D3D12_DESCRIPTOR_HEAP_FLAG_NONE;
        ThrowIfFailed(m_device->CreateDescriptorHeap(&rtvHeapDesc, IID_PPV_ARGS(&m_rtvHeap)));

        m_rtvDescriptorSize = m_device->GetDescriptorHandleIncrementSize(D3D12_DESCRIPTOR_HEAP_TYPE_RTV);
    }

    // Create frame resources.
    {
        CD3DX12_CPU_DESCRIPTOR_HANDLE rtvHandle(m_rtvHeap->GetCPUDescriptorHandleForHeapStart());

        // Create a RTV for each frame.
        for (UINT n = 0; n < FrameCount; n++)
        {
            ThrowIfFailed(m_swapChain->GetBuffer(n, IID_PPV_ARGS(&m_renderTargets[n])));
            m_device->CreateRenderTargetView(m_renderTargets[n].Get(), nullptr, rtvHandle);
            rtvHandle.Offset(1, m_rtvDescriptorSize);
        }
    }

    ThrowIfFailed(m_device->CreateCommandAllocator(D3D12_COMMAND_LIST_TYPE_DIRECT, IID_PPV_ARGS(&m_commandAllocator)));
}

// Load the sample assets.
void D3D12HelloWindow::LoadAssets()
{
    // Create the command list.
    ThrowIfFailed(m_device->CreateCommandList(0, D3D12_COMMAND_LIST_TYPE_DIRECT, m_commandAllocator.Get(), nullptr, IID_PPV_ARGS(&m_commandList)));

    // Command lists are created in the recording state, but there is nothing
    // to record yet. The main loop expects it to be closed, so close it now.
    ThrowIfFailed(m_commandList->Close());

    // Create synchronization objects.
    {
        ThrowIfFailed(m_device->CreateFence(0, D3D12_FENCE_FLAG_NONE, IID_PPV_ARGS(&m_fence)));
        m_fenceValue = 1;

        // Create an event handle to use for frame synchronization.
        m_fenceEvent = CreateEvent(nullptr, FALSE, FALSE, nullptr);
        if (m_fenceEvent == nullptr)
        {
            ThrowIfFailed(HRESULT_FROM_WIN32(GetLastError()));
        }
    }
}

// Update frame-based values.
void D3D12HelloWindow::OnUpdate()
{
}

// Render the scene.
void D3D12HelloWindow::OnRender()
{
    // Record all the commands we need to render the scene into the command list.
    PopulateCommandList();

    // Execute the command list.
    ID3D12CommandList* ppCommandLists[] = { m_commandList.Get() };
    m_commandQueue->ExecuteCommandLists(_countof(ppCommandLists), ppCommandLists);

    // Present the frame.
    ThrowIfFailed(m_swapChain->Present(1, 0));

    WaitForPreviousFrame();
}

void D3D12HelloWindow::OnDestroy()
{
    // Ensure that the GPU is no longer referencing resources that are about to be
    // cleaned up by the destructor.
    WaitForPreviousFrame();

    CloseHandle(m_fenceEvent);
}

void D3D12HelloWindow::PopulateCommandList()
{
    // Command list allocators can only be reset when the associated 
    // command lists have finished execution on the GPU; apps should use 
    // fences to determine GPU execution progress.
    ThrowIfFailed(m_commandAllocator->Reset());

    // However, when ExecuteCommandList() is called on a particular command 
    // list, that command list can then be reset at any time and must be before 
    // re-recording.
    ThrowIfFailed(m_commandList->Reset(m_commandAllocator.Get(), m_pipelineState.Get()));

    // Indicate that the back buffer will be used as a render target.
    m_commandList->ResourceBarrier(1, &CD3DX12_RESOURCE_BARRIER::Transition(m_renderTargets[m_frameIndex].Get(), D3D12_RESOURCE_STATE_PRESENT, D3D12_RESOURCE_STATE_RENDER_TARGET));

    CD3DX12_CPU_DESCRIPTOR_HANDLE rtvHandle(m_rtvHeap->GetCPUDescriptorHandleForHeapStart(), m_frameIndex, m_rtvDescriptorSize);

    // Record commands.
    const float clearColor[] = { 0.0f, 0.2f, 0.4f, 1.0f };
    m_commandList->ClearRenderTargetView(rtvHandle, clearColor, 0, nullptr);

    // Indicate that the back buffer will now be used to present.
    m_commandList->ResourceBarrier(1, &CD3DX12_RESOURCE_BARRIER::Transition(m_renderTargets[m_frameIndex].Get(), D3D12_RESOURCE_STATE_RENDER_TARGET, D3D12_RESOURCE_STATE_PRESENT));

    ThrowIfFailed(m_commandList->Close());
}

void D3D12HelloWindow::WaitForPreviousFrame()
{
    // WAITING FOR THE FRAME TO COMPLETE BEFORE CONTINUING IS NOT BEST PRACTICE.
    // This is code implemented as such for simplicity. The D3D12HelloFrameBuffering
    // sample illustrates how to use fences for efficient resource usage and to
    // maximize GPU utilization.

    // Signal and increment the fence value.
    const UINT64 fence = m_fenceValue;
    ThrowIfFailed(m_commandQueue->Signal(m_fence.Get(), fence));
    m_fenceValue++;

    // Wait until the previous frame is finished.
    if (m_fence->GetCompletedValue() < fence)
    {
        ThrowIfFailed(m_fence->SetEventOnCompletion(fence, m_fenceEvent));
        WaitForSingleObject(m_fenceEvent, INFINITE);
    }

    m_frameIndex = m_swapChain->GetCurrentBackBufferIndex();
}
```
![스크린샷 2024-06-04 160842](https://github.com/junbem/AI-Graphics/assets/50951220/d4d40b35-2649-47d9-81c5-b0ee53523adf)
1. 디버그 설정: _DEBUG 매크로가 정의되어 있으면, 코드는 디버그 레이어를 활성화하고 추가적인 디버그 레이어를 활성화합니다. 이것은 디버깅을 용이하게 하고 오류를 식별하는 데 도움이 됩니다.
2. 파이프라인 로드: LoadPipeline 함수는 렌더링에 필요한 DirectX 12 파이프라인을 로드합니다. 이것은 디바이스 생성, 커맨드 큐 생성, 스왑 체인 생성 등의 작업을 포함합니다.
3. 자산 로드: LoadAssets 함수는 샘플 자산을 로드합니다. 여기서는 주로 초기화 작업이 이루어집니다.
4. 프레임 업데이트: OnUpdate 함수는 프레임마다 값의 업데이트를 처리합니다. 이 예제에서는 아무 작업도 수행하지 않습니다.
5. 렌더링: OnRender 함수는 실제 렌더링을 수행합니다. PopulateCommandList 함수에서 렌더링 명령이 커맨드 리스트에 기록되고, 이후 커맨드 리스트가 실행되어 실제 렌더링이 발생합니다.
6. 프레임 완료 대기: WaitForPreviousFrame 함수는 이전 프레임의 완료를 기다립니다. 이는 특별히 최적화되지 않은 방법으로 구현되었으며, 실제 애플리케이션에서는 효율적인 자원 사용을 위해 피치해야 할 수 있습니다.

## HelloTriangle 추가부분 및 설명
```
// 첫 번째 코드에서는 D3D12HelloWindow 클래스를 사용하고, 렌더링 파이프라인의 상태 전이를 처리합니다.
class D3D12HelloWindow : public DXSample
{
public:
    D3D12HelloWindow(UINT width, UINT height, std::wstring name);

    virtual void OnInit();
    virtual void OnUpdate();
    virtual void OnRender();
    virtual void OnDestroy();

private:
    static const UINT FrameCount = 2;

    // 멤버 변수
    UINT m_frameIndex;
    UINT m_rtvDescriptorSize;
    ComPtr<ID3D12Device> m_device;
    ComPtr<IDXGISwapChain3> m_swapChain;
    ComPtr<ID3D12CommandAllocator> m_commandAllocator;
    ComPtr<ID3D12CommandQueue> m_commandQueue;
    ComPtr<ID3D12RootSignature> m_rootSignature;
    ComPtr<ID3D12DescriptorHeap> m_rtvHeap;
    ComPtr<ID3D12PipelineState> m_pipelineState;
    ComPtr<ID3D12GraphicsCommandList> m_commandList;
    ComPtr<ID3D12Resource> m_renderTargets[FrameCount];
    HANDLE m_fenceEvent;
    ComPtr<ID3D12Fence> m_fence;
    UINT64 m_fenceValue;

    // 함수
    void LoadPipeline();
    void LoadAssets();
    void PopulateCommandList();
    void WaitForPreviousFrame();
};

// 두 번째 코드에서는 D3D12HelloTriangle 클래스를 사용하고, 삼각형을 렌더링하는 버텍스 데이터를 정의하고 이를 사용하여 렌더링합니다.
class D3D12HelloTriangle : public DXSample
{
public:
    D3D12HelloTriangle(UINT width, UINT height, std::wstring name);

    virtual void OnInit();
    virtual void OnUpdate();
    virtual void OnRender();
    virtual void OnDestroy();

private:
    static const UINT FrameCount = 2;

    // 삼각형을 렌더링하는 버텍스 데이터
    struct Vertex
    {
        XMFLOAT3 position;
        XMFLOAT4 color;
    };

    // 멤버 변수
    ComPtr<ID3D12Device> m_device;
    ComPtr<IDXGISwapChain3> m_swapChain;
    ComPtr<ID3D12CommandAllocator> m_commandAllocator;
    ComPtr<ID3D12CommandQueue> m_commandQueue;
    ComPtr<ID3D12RootSignature> m_rootSignature;
    ComPtr<ID3D12DescriptorHeap> m_rtvHeap;
    ComPtr<ID3D12PipelineState> m_pipelineState;
    ComPtr<ID3D12GraphicsCommandList> m_commandList;
    UINT m_rtvDescriptorSize;
    ComPtr<ID3D12Resource> m_renderTargets[FrameCount];
    UINT m_frameIndex;
    HANDLE m_fenceEvent;
    ComPtr<ID3D12Fence> m_fence;
    UINT64 m_fenceValue;
    ComPtr<ID3D12Resource> m_vertexBuffer;
    D3D12_VERTEX_BUFFER_VIEW m_vertexBufferView;

    // 함수
    void LoadPipeline();
    void LoadAssets();
    void PopulateCommandList();
    void WaitForPreviousFrame();
};
```
![스크린샷 2024-06-04 162716](https://github.com/junbem/AI-Graphics/assets/50951220/7826200d-a0ff-4ed7-bcd9-5473a48ae488)
1. **클래스 이름과 종속성**: 두 코드 모두 DirectX 12를 사용하여 Windows 창에 렌더링하는 예제를 보여줍니다. 그러나 첫 번째 코드는 `D3D12HelloWindow` 클래스를 사용하고, 두 번째 코드는 `D3D12HelloTriangle` 클래스를 사용합니다. 또한 두 번째 코드에서는 `DXSample` 클래스를 상속하는 반면, 첫 번째 코드는 해당 클래스가 누락되어 있습니다.
2. **렌더링 방식**: 첫 번째 코드는 각 프레임마다 백 버퍼를 클리어하고 다시 렌더링하는 방식을 사용합니다. 반면, 두 번째 코드는 정점 데이터를 사용하여 삼각형을 렌더링하는 간단한 씬을 보여줍니다. 따라서 각 코드는 다른 렌더링 방식을 보여줍니다.
3. **버텍스 데이터**: 두 번째 코드는 버텍스 데이터를 정의하고 이를 사용하여 삼각형을 렌더링하는 데 필요한 버텍스 버퍼를 생성합니다. 반면, 첫 번째 코드는 이러한 작업을 수행하지 않습니다.
4. **파이프라인 상태**: 첫 번째 코드는 렌더링 파이프라인의 상태 전이를 처리하기 위해 `PopulateCommandList` 함수에서 백 버퍼의 상태를 전환합니다. 반면, 두 번째 코드는 이러한 작업을 수행하지 않습니다.

요약하면, 두 코드 모두 DirectX 12를 사용하여 Windows 창에 렌더링하는 방법을 보여주지만, 각각 다른 렌더링 방식을 보여주며 구현에 중요한 차이가 있습니다.

## HelloTexture 추가부분 및 설명
```
// Pipeline objects.
ComPtr<ID3D12Resource> m_texture; // Texture resource
ComPtr<ID3D12DescriptorHeap> m_srvHeap; // Shader Resource View (SRV) heap

// App resources.
static const UINT TextureWidth = 256;
static const UINT TextureHeight = 256;
static const UINT TexturePixelSize = 4; // The number of bytes used to represent a pixel in the texture

// Load the rendering pipeline dependencies.
void LoadPipeline();
// Load the sample assets.
void LoadAssets();
// Generate a simple black and white checkerboard texture.
std::vector<UINT8> GenerateTextureData();
// Update frame-based values.
virtual void OnUpdate();
// Render the scene.
virtual void OnRender();
// Clean up the resources.
virtual void OnDestroy();
// Populate the command list.
void PopulateCommandList();
// Wait for the previous frame to complete.
void WaitForPreviousFrame();
```
아래의 코드는 `D3D12HelloTexture` 클래스에 추가된 멤버 변수 및 메서드들을 나타냅니다. 

```cpp
// Pipeline objects.
ComPtr<ID3D12Resource> m_texture; // Texture resource
ComPtr<ID3D12DescriptorHeap> m_srvHeap; // Shader Resource View (SRV) heap

// App resources.
static const UINT TextureWidth = 256;
static const UINT TextureHeight = 256;
static const UINT TexturePixelSize = 4; // The number of bytes used to represent a pixel in the texture

// Load the rendering pipeline dependencies.
void LoadPipeline();
// Load the sample assets.
void LoadAssets();
// Generate a simple black and white checkerboard texture.
std::vector<UINT8> GenerateTextureData();
// Update frame-based values.
virtual void OnUpdate();
// Render the scene.
virtual void OnRender();
// Clean up the resources.
virtual void OnDestroy();
// Populate the command list.
void PopulateCommandList();
// Wait for the previous frame to complete.
void WaitForPreviousFrame();
```
![image](https://github.com/junbem/AI-Graphics/assets/50951220/01a8cfcd-0cd9-4cd4-a24f-3b9b3aac010a)

`D3D12HelloTexture` 클래스에는 다음과 같은 추가 기능이 포함되어 있습니다:
1. 텍스처를 나타내는 `ID3D12Resource` 객체 및 해당 객체에 대한 셰이더 리소스 뷰(SRV) 힙인 `ID3D12DescriptorHeap` 객체를 추가로 선언합니다.
2. 텍스처 생성 및 초기화를 위한 `LoadAssets` 및 `GenerateTextureData` 메서드가 추가됩니다.
3. 매 프레임마다 호출되는 `OnUpdate` 및 `OnRender` 메서드가 추가됩니다.
4. 자원 정리를 위한 `OnDestroy` 메서드가 추가됩니다.
5. 명령 목록을 채우는 `PopulateCommandList` 메서드가 추가됩니다.
6. 이전 프레임이 완료될 때까지 기다리는 `WaitForPreviousFrame` 메서드가 추가됩니다.




