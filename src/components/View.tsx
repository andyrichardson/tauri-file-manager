import { invoke } from '@tauri-apps/api/tauri'
import styled from "styled-components";
import FolderIcon from '/usr/share/icons/Adwaita/512x512/places/folder.png';
import TextIcon from '/usr/share/icons/Adwaita/512x512/mimetypes/text-x-generic.png';
import AudioIcon from '/usr/share/icons/Adwaita/512x512/mimetypes/audio-x-generic.png';
import { Node, useAppContext } from "../context";
import {useCallback, useState} from "preact/hooks";

export const View = () => {
	const [selected, setSelected] = useState<string | undefined>();
  const { nodes, setPath, path } = useAppContext();

	invoke('read_dir', { path: '/home/andy' }).then(console.log)

	const onContainerClick = useCallback(() => setSelected(undefined), []);

	const onNodeClick = useCallback((node: Node) => (e: any) => {
		e.stopPropagation();
		
		if (selected === node.name) {
		  console.log("SETTING PATH")
		  return setPath(p => `${p}/${node.name}`)
		}
		
		setSelected(node.name);

	}, [selected])

  return (
    <Container onClick={onContainerClick}>
      {nodes.sort((a, b) => a.name.localeCompare(b.name)).map((n) => (
				<NodeContainer aria-selected={n.name == selected} onClick={onNodeClick(n)}>
					<DirIcon src={getIconForNode(n)} />
          <Name>{n.name}</Name>
        </NodeContainer>
      ))}
    </Container>
  );
};

const getIconForNode = (n: Node) => {
	if (n.kind === "dir") {
    return FolderIcon;
	}

	if ((n as any).mime.includes("text")) {
    return TextIcon;
	}

	if ((n as any).mime.includes("audio")) {
    return AudioIcon;
	}

	return FolderIcon;
}

const Container = styled.ul`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-gap: 30px;
	background: #373737;
	margin: 0;
	padding: 20px;
	color: #fff;
`;

const NodeContainer = styled.li`
	border-radius: 10px;
	display: flex;
	align-items: center;
	flex-direction: column;
  list-style-type: none;
	padding: 10px;
	height: fit-content;
	overflow: hidden;
	cursor: pointer;

	&[aria-selected="true"] {
    background: #4C6A8F;
	}
`;

const Name = styled.p`
  text-align: center;
	overflow-wrap: break-word;
	margin: 0;
	margin-top: 0.8em;
`;

const DirIcon = styled.img`
	color: #777;
	font-size: 60px;
	width: 90px;
`;
