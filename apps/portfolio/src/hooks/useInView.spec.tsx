import { act, cleanup, render, screen } from '@testing-library/react';

import { useInView } from './useInView';

type ProbeProps = {
  options?: Parameters<typeof useInView>[0];
};

function Probe({ options }: ProbeProps) {
  const { ref, inView } = useInView(options);
  return (
    <div ref={ref} data-testid="probe">
      {inView ? 'in' : 'out'}
    </div>
  );
}

// Mimics a consumer rendering its element conditionally: the ref stays detached
function DetachedProbe() {
  const { inView } = useInView();
  return <div data-testid="detached">{inView ? 'in' : 'out'}</div>;
}

describe('useInView', () => {
  let observeMock: ReturnType<typeof vi.fn>;
  let disconnectMock: ReturnType<typeof vi.fn>;
  let observerCallback: IntersectionObserverCallback;
  let observerInit: IntersectionObserverInit | undefined;

  beforeEach(() => {
    observeMock = vi.fn();
    disconnectMock = vi.fn();
    observerInit = undefined;

    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn(function (
        this: {
          observe: typeof observeMock;
          disconnect: typeof disconnectMock;
        },
        callback: IntersectionObserverCallback,
        init?: IntersectionObserverInit,
      ) {
        observerCallback = callback;
        observerInit = init;
        this.observe = observeMock;
        this.disconnect = disconnectMock;
      }),
    );
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  function intersect(isIntersecting: boolean) {
    act(() => {
      observerCallback(
        [{ isIntersecting } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
  }

  it('should start with inView false and observe the ref element', () => {
    render(<Probe />);

    expect(screen.getByTestId('probe')).toHaveTextContent('out');
    expect(observeMock).toHaveBeenCalledWith(screen.getByTestId('probe'));
  });

  it('should not observe when the ref is not attached to an element', () => {
    render(<DetachedProbe />);

    expect(IntersectionObserver).not.toHaveBeenCalled();
    expect(screen.getByTestId('detached')).toHaveTextContent('out');
  });

  it('should flip inView to true when entry intersects', () => {
    render(<Probe />);

    intersect(true);

    expect(screen.getByTestId('probe')).toHaveTextContent('in');
  });

  it('should flip inView back to false when no longer intersecting', () => {
    render(<Probe />);

    intersect(true);
    expect(screen.getByTestId('probe')).toHaveTextContent('in');

    intersect(false);
    expect(screen.getByTestId('probe')).toHaveTextContent('out');
  });

  it('should disconnect after first intersection when once is true', () => {
    render(<Probe options={{ once: true }} />);

    intersect(true);

    expect(screen.getByTestId('probe')).toHaveTextContent('in');
    expect(disconnectMock).toHaveBeenCalledTimes(1);

    intersect(false);

    expect(screen.getByTestId('probe')).toHaveTextContent('in');
  });

  it('should forward observer init options and strip `once`', () => {
    render(
      <Probe options={{ threshold: 0.7, rootMargin: '10px', once: true }} />,
    );

    expect(observerInit).toEqual({ threshold: 0.7, rootMargin: '10px' });
  });

  it('should disconnect observer on unmount', () => {
    const { unmount } = render(<Probe />);

    unmount();

    expect(disconnectMock).toHaveBeenCalled();
  });
});
