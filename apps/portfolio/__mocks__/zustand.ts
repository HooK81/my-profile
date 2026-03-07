import * as zustand from 'zustand';

const { create: actualCreate } =
  await vi.importActual<typeof zustand>('zustand');

const storeResetFns = new Set<() => void>();

function createWithReset(createState?: unknown): unknown {
  if (createState == null) {
    return (stateCreator: unknown) => createWithReset(stateCreator);
  }

  const store = actualCreate(
    createState as zustand.StateCreator<Record<string, unknown>>,
  );
  const initialState = store.getInitialState();
  storeResetFns.add(() => store.setState(initialState, true));
  return store;
}

export const create = createWithReset as typeof zustand.create;

afterEach(() => {
  storeResetFns.forEach((resetFn) => resetFn());
});
