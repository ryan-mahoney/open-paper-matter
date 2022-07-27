import React, { useEffect, useState } from "react";
import { invoke } from '@tauri-apps/api'
import Breadcrumbs from "./components/Breadcrumbs";
import Table from "./components/Table";
import Drawer from "./components/Drawer";
import PublishDrawer from "./components/PublishDrawer";
import { File, Folder } from "../dropbox_types";

const listFiles = async (folderPath: String): Promise<File[]> => {
    let metadata = await invoke('list_target_dir', { target: "" })
    let list: File[] = (metadata as Array<File | Folder>).filter((data) => { return data[".tag"] === "file" }) as File[];
    return list;
};

const Documents = ({ breadcrumbs, dispatch, folderPath }: any) => {
    const [documents, setDocuments] = useState<File[]>([]);
    const [activeDocumentId, setActiveDocumentId] = useState<String | null>(null);
    const [publishDrawOpen, togglePublishDrawer] = useState(false);

    useEffect(() => {
        listFiles(folderPath).then((documents) =>
            setDocuments(documents)
        );
    }, [folderPath]);

    return (
        <div>
            <Breadcrumbs paths={breadcrumbs} dispatch={dispatch} />
            <div className="flex mb-4">
                <h2 className="shrink-0 text-3xl font-bold text-gray-800 md:text-2xl self-center">
                    Documents
                </h2>
                <button
                    className="ml-4 text-sm px-2 py-1 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                    onClick={() => togglePublishDrawer(!publishDrawOpen)}
                >
                    Publish Documents to Local
                </button>
            </div>
            <Table headers={["Document Title"]}>
                {documents.map(({ id, name }) => (
                    <tr key={id} className="text-gray-700">
                        <td className="px-4 py-3">
                            <div className="flex items-center text-sm">
                                <div
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (activeDocumentId === null) {
                                            setActiveDocumentId(id);
                                        } else if (activeDocumentId === id) {
                                            setActiveDocumentId(null);
                                        } else {
                                            setActiveDocumentId(null);
                                            setActiveDocumentId(id);
                                        }
                                    }}
                                >
                                    {name}
                                </div>
                            </div>
                        </td>
                    </tr>
                ))}
            </Table>

            <Drawer
                show={activeDocumentId !== null}
                documentId={activeDocumentId}
                setActiveDocumentId={setActiveDocumentId}
            />

            <PublishDrawer
                show={publishDrawOpen === true}
                folderPath={folderPath}
                togglePublishDrawer={togglePublishDrawer}
            />
        </div>
    );
};

export default Documents;
