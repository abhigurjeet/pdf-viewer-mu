import { useEffect, useRef, useState } from "react";
import getToolbarConfig from "./Toolbar";
// import { invoke } from '@tauri-apps/api/core';
import PSPDFKit from "@nutrient-sdk/viewer";
import { getTooltipReadAloud } from "./utils";
import { invoke } from "@tauri-apps/api/core";
import { useAppSelector, RootState, AppDispatch } from "../../store";
import { setAppTheme } from "../../store/slices/settingsSlice";
import { useDispatch } from "react-redux";
import { setRecentlyViewedBook } from "../../store/slices/userBooksSlice";


declare const Theme: {
    readonly LIGHT: "LIGHT";
    readonly DARK: "DARK";
    readonly AUTO: "AUTO";
};
const { NutrientViewer } = window;
function PdfViewer(props: any) {
    const [disableSelect, setDisableSelect] = useState(false);
    const containerRef = useRef(null);
    const instanceRef = useRef<any>(null); // Replace instanceRef.current
    const theme: typeof Theme[keyof typeof Theme] = useAppSelector((state: RootState) => state.settings.theme);
    const dispatch = useDispatch<AppDispatch>();
    const token = useAppSelector((state: RootState) => state.auth.token);
    // const [theme, setTheme] = useState<ITheme>(PSPDFKit.Theme.DARK);
    // const [instantJSON, setInstantJSON] = useState<any>(null)
    let selectedText: any = '';
    // Optional: set Indian English voice if available
    const voices = speechSynthesis.getVoices();
    // console.log("voice", voices)
    const indianEnglishVoice = voices.find(v => v.lang === "en-IN");

    const books  = useAppSelector((state: RootState) => state.userBooks.books);
    debugger
    const currentItem = books.find((book:any)=>book.editionId == props.id);
    console.log("currentItem",currentItem)


    const speaker = async () => {
        if (speechSynthesis.speaking || speechSynthesis.pending) {
            speechSynthesis.cancel();
            return
        }
        // console.log(instanceRef.current)
        instanceRef.current.setViewState((v: any) => v.set("currentPageIndex", 0));
        for (let i = 0; i < instanceRef.current.totalPageCount; i++) {
            await speakText(i).then((_r: any) => {
                instanceRef.current.setViewState((v: any) => v.set("currentPageIndex", i + 1));
            });
        }
        return
    }


    async function speakText(i: number): Promise<void> {
        const textLines = await instanceRef.current.textLinesForPageIndex(i);
        let str = ''
        textLines.forEach((textLine: any, _textLineIndex: any) => {
            // console.log(`Content for text line ${textLineIndex}`);
            // console.log(`Text: ${textLine.contents}`);
            // console.log(`Id: ${textLine.id}`);
            // console.log(`Page index: ${textLine.pageIndex}`);
            // // console.log(`Bounding box: ${JSON.stringify(textLine.boundingBox.toJS())}`);
            str += textLine.contents;
        });
        await speakInputText(str)
    }

    async function toolTipTextSpeach() {
        await speakInputText(selectedText)
    }


    async function speakInputText(str: string): Promise<void> {
        if (!str) {
            return
        }
        // Stop ongoing speech before starting new
        if (speechSynthesis.speaking || speechSynthesis.pending) {
            speechSynthesis.cancel();

        }
        return new Promise((resolve, reject) => {
            const utterance = new SpeechSynthesisUtterance(str);
            utterance.lang = "en-IN"; // English (India)
            if (indianEnglishVoice) {
                utterance.voice = indianEnglishVoice;
            }
            console.log("indianEnglishVoice", indianEnglishVoice)
            utterance.onend = () => {
                console.log("Speech finished for this page.");
                resolve();
            };
            utterance.onerror = (event) => {
                console.error("Speech error:", event.error);
                reject(event.error);
            };
            speechSynthesis.speak(utterance);
        });
    }

    const showWaterMark = (ctx: any, pageSize: any) => {
        // ctx.save();
        const centerX = pageSize.width / 2;
        const centerY = pageSize.height / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate(-Math.PI / 4);

        ctx.font = "60px Arial";
        ctx.fillStyle = "rgba(76, 130, 212, 0.1)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        let waterMarkLabel = "Taxmann Pvt Ltd.";//localStorage.getItem("userName");
        ctx.fillText(waterMarkLabel, 0, 0);
        // ctx.restore();
    }

    function toggleTheme() {
        if (theme == PSPDFKit.Theme.DARK) {
            dispatch(setAppTheme(PSPDFKit.Theme.LIGHT))
        } else {
            dispatch(setAppTheme(PSPDFKit.Theme.DARK))
        }
    }

    async function loadPdf() {
        const container = containerRef.current;
        const customToolBarProps = [
            {
                "key": "READ_ALOUD",
                "fn": speaker
            },
            {
                "key": "THEME",
                "fn": toggleTheme
            }

        ];//custom props


        if (container && NutrientViewer) {
            let toolbarItems = getToolbarConfig(customToolBarProps);
            const config: any = {
                container,
                disableWebAssemblyStreaming: true,
                inlineWorkers: false,
                document: props.buffer,
                toolbarItems: toolbarItems,
                theme: theme,
                licenseKey: "",
                // autoSaveMode: PSPDFKit.AutoSaveMode.INTELLIGENT,
                // toolbarPlacement: PSPDFKit.ToolbarPlacement.TOP,

                styleSheets: ['./pdfstyle.css'],
                renderPageCallback(ctx: any, _pageIndex: any, pageSize: any) {
                    showWaterMark(ctx, pageSize);
                },
                isEditableAnnotation: function (_annotation: any) {
                    // console.log(annotation)
                    return true
                },
                isEditableComment: function (comment: any) {
                    console.log(comment)
                    return false
                },
                annotationToolbarItems: (_annotation: any, { defaultAnnotationToolbarItems, hasDesktopLayout }: any) => {
                    const modifyToolBar = defaultAnnotationToolbarItems.filter((annottool: any) => annottool.type != "blend-mode")
                    console.log("hasDesktopLayout", hasDesktopLayout)
                    // const node = document.createElement('node')
                    // node.innerText = "Custom Item"

                    // const icon = `<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>`

                    // return [{
                    //     id: "custom",
                    //     type: "custom",
                    //     node: node,
                    //     icon: icon,
                    //     className: 'Custom-Node',
                    //     onPress: () => {
                    //         console.log("Custom node clicked")
                    //     }
                    // }, ...modifyToolBar]; // enable above if custom node want to add
                    return modifyToolBar
                }
                // renderPageCallback: function (_ctx: CanvasRenderingContext2D, pageIndex: number, _pageSize: Size) {
                //     if (pageIndex === 0) {
                //         console.log("First page loaded");
                //     }
                //     if (pageIndex === instanceRef.current.totalPageCount - 1) {
                //         console.log("Last page loaded");
                //     }
                // },
            }
            // console.log("JSONS",JSON.stringify( props.annotResponse))
            if (props?.annotResponse && props.annotResponse?.length) {
                config["instantJSON"] = props.annotResponse[0];

            }
            await NutrientViewer.load(config).then((instance) => {
                instanceRef.current = instance;
                // layoutMode: PSPDFKit.LayoutMode.SINGLE,
                // scrollmode: PSPDFKit.ScrollMode.PER_SPREAD,
                setPdfViewState();
                onEventListener();
                debugger
                if(token) {
                    dispatch(setRecentlyViewedBook(currentItem))
                }
               

            })
        }
    }

    function setPdfViewState() {
        if (!instanceRef.current) {
            return;
        }
        // instanceRef.current.setViewState((v: any) => v.set("previewRedactionMode", false));
        // instanceRef.current.setViewState((v: any) => v.set("showComments", false));
        // instanceRef.current.setViewState((v: any) => v.set("showAnnotationNotes", false));
        // instanceRef.current.setViewState((v: any) => v.set("enableAnnotationToolbar", false));
        // instanceRef.current.setAnnotationCreatorName("Manoj Yadav");
        const item = getTooltipReadAloud(toolTipTextSpeach)
        // tooltip hide comments
        instanceRef.current.setInlineTextSelectionToolbarItems(({ defaultItems }: any) => {
            let online = window.navigator.onLine;
            if (!online) {
                return [item]
            }
            defaultItems = defaultItems.filter((e: any) => !["comment","redact-text-highlighter"].includes(e.type))
            // console.log("defaultItems", defaultItems)
            //comment//redact-text-highlighter//squiggle//strikeout//underline//highlight
            return [...defaultItems, item];
        });
    }

    async function saveUserAnnotation() {
        instanceRef.current.save();
        const instantJSON = await instanceRef.current.exportInstantJSON();
        const response = await invoke("upload_annotations", {
            "annotationData": {
                "bookid": props.id,
                "annotations": instantJSON,
                "token": token
            }
        }).catch(err => {
            console.log(err)
        });
        console.log("response", response);
    }

    function onEventListener() {
        document.addEventListener('copy', (e: any) => {
            e.preventDefault();
            e.clipboardData.setData('text/plain', '');
        });

        instanceRef.current.addEventListener("bookmarks.create", () => {
            console.log("Your bookmarks changed!");
             saveUserAnnotation()
        });
        instanceRef.current.addEventListener("bookmarks.update", () => {
            console.log("Your bookmarks changed!");
             saveUserAnnotation()
        });
        instanceRef.current.addEventListener("bookmarks.delete", () => {
            console.log("Your bookmarks changed!");
             saveUserAnnotation()
        });
        instanceRef.current.addEventListener("textSelection.change", (textSelection: any) => {
            if (textSelection) {
                textSelection.getText().then((text: any) => {
                    console.log("text", text, textSelection);
                    selectedText = text
                });
            } else {
                console.log("no text is selected");
            }
        });
        instanceRef.current.addEventListener("annotations.create",  (annotations: any) => {
            console.log("annotationseach", annotations.toJS())
            console.log(`instance Save state changed`);
            // const curAnnot = annotations.toJS()[0];
            // instanceRef.current.save();
            // setTimeout(async () => {
            //     const instantJSON = await instanceRef.current.exportInstantJSON();
            //     console.log(instantJSON);
            //     const response = await invoke("upload_annotations", {
            //         "annotationData": {
            //             "bookid": props.id,
            //             "annotations": instantJSON,
            //             "token": token
            //         }
            //     }).catch(err => {
            //         console.log(err)
            //     });
            //     console.log("response", response);
            // }, 100);
            // setInstantJSON(instantJSON)
              saveUserAnnotation()
        });
        instanceRef.current.addEventListener("annotations.update",  (annotations: any) => {
            console.log("annotationseach", annotations.toJS())
            console.log(`instance Save state changed`);
            // const curAnnot = annotations.toJS()[0];
            // instanceRef.current.save();
            // setTimeout(async () => {
            //     const instantJSON = await instanceRef.current.exportInstantJSON();
            //     console.log(instantJSON);
            //     const response = await invoke("upload_annotations", {
            //         "annotationData": {
            //             "bookid": props.id,
            //             "annotations": instantJSON,
            //             "token": token
            //         }
            //     }).catch(err => {
            //         console.log(err)
            //     });
            //     console.log("response", response);
            // }, 100);
              saveUserAnnotation();
            // setInstantJSON(instantJSON)
        });
        instanceRef.current.addEventListener("annotations.delete",  (annotations: any) => {
            console.log("annotationseach", annotations.toJS())
            console.log(`instance Save state changed`);
            // const curAnnot = annotations.toJS()[0];
            // instanceRef.current.save();
            // setTimeout(async () => {
            //     const instantJSON = await instanceRef.current.exportInstantJSON();
            //     console.log(instantJSON);
            //     const response = await invoke("upload_annotations", {
            //         "annotationData": {
            //             "bookid": props.id,
            //             "annotations": instantJSON,
            //             "token": token
            //         }
            //     }).catch(err => {
            //         console.log(err)
            //     });
            //     console.log("response", response);
            // }, 100);
              saveUserAnnotation();
            // setInstantJSON(instantJSON)
        });
        instanceRef.current.addEventListener("document.saveStateChange", (event: any) => {
            console.log(`Save state changed: ${event.hasUnsavedChanges}`);
        });
    }

    useEffect(() => {
        // async function loadUrl() {
        //     let urlP = "https://cdn.taxmann.dev/learnings/session/Succession_Planning_&_Income-tax_Issues_in_a_Cross-Border_Scenario_-_Radhika_Gaggar_1745907392753.pdf"
        //     const pdfBytes = await invoke<Uint8Array>("fetch_pdf_from_url", {
        //         url: urlP
        //     });
        //     const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
        //     const url = URL.createObjectURL(blob);
        //     setPdfUrl(url);
        // }
        // loadUrl();
    }, []);

    useEffect(() => {
        loadPdf()
        return () => {
            if (speechSynthesis.speaking || speechSynthesis.pending) {
                speechSynthesis.cancel();
            }
            containerRef.current && NutrientViewer?.unload(containerRef.current);
        };
    }, [theme]);

     

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setDisableSelect(true);
    setTimeout(() => {
        setDisableSelect(false);
    }, 400);
  };



    return <div className={`${disableSelect ? "select-none" : ""}`} onContextMenu={handleContextMenu} ref={containerRef} style={{ height: "93vh", width: "100vw" }} />;
    // return  <div ref={containerRef} className="bg-[#f9f9fb] pl-2 pr-2 rounded-2xl shadow-sm m-2" style={{ height: "90vh", width: "98vw" }}></div>


}

export default PdfViewer

