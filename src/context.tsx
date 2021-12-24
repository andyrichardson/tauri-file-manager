import { invoke } from '@tauri-apps/api/tauri'
import {
  createContext,
  FC,
  useMemo,
  useState,
  useCallback,
	useEffect,
	useContext,
	Dispatch,
	SetStateAction
} from "react";

type AppContext = {
  path: string;
setPath: Dispatch<SetStateAction<string>>;
  nodes: Node[];
};

export type FileNode = { kind: "file"; name: string, hidden: boolean };

export type DirNode = { kind: "dir"; name: string, hidden: boolean };

export type Node = FileNode | DirNode;

type AppState = Pick<AppContext, "path" | "nodes">;

export const AppContext = createContext<AppContext>(null as any);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: FC = (props) => {
  const [state, setState] = useState<AppState>({ path: "/home/andy", nodes: [] });
  console.log(state)
	useEffect(() => {
			invoke('read_dir', { path: '/home/andy' }).then((results) => {
					setState(s => ({
								...s,
								nodes: results.map(r => r.Dir ? ({ kind: "dir", ...r.Dir }) : ({ kind: "file", ...r.File })),
								}));
			})
		}, [state.path]);

  const setPath = useCallback<AppContext['setPath']>(
			(path) => setState((s) => ({ ...s, path: typeof path === "string" ? path : path(s.path) })),
    []
  );

  const value = useMemo(() => ({ ...state, setPath }), [state]);

  return <AppContext.Provider {...props} value={value} />;
};
