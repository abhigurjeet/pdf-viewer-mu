import { useAnnotationCapability } from "@embedpdf/plugin-annotation/react";
import { useSelectionCapability } from "@embedpdf/plugin-selection/react";
import { PdfAnnotationSubtype, Rect } from "@embedpdf/models";
import { DeleteAnnotation } from "./delete-annotation";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import FormatUnderlinedOutlinedIcon from "@mui/icons-material/FormatUnderlinedOutlined";
import StrikethroughSOutlinedIcon from "@mui/icons-material/StrikethroughSOutlined";
import { ToggleIconButton } from "../toggle-icon-button";

export const AnnotationTool = () => {
  const { provides: annotation } = useAnnotationCapability();
  const { provides: selection } = useSelectionCapability();

  const annotateSelection = async (type:string) => {
    try {
      if (!annotation || !selection) {
        console.warn("Annotation or selection capability not available");
        return;
      }

      // Grab selected rects grouped by page
      const rectsByPage = selection.getHighlightRects();
      if (!rectsByPage) {
        console.warn("No rects found in selection");
        return;
      }

      for (const [pageIndexStr, rects] of Object.entries(rectsByPage)) {
        const pageIndex = Number(pageIndexStr);
        if (!rects.length) continue;

        // Build a bounding box (rect) for this page’s selection
        const boundingRect: Rect = {
          origin: {
            x: Math.min(...rects.map((r) => r.origin.x)),
            y: Math.min(...rects.map((r) => r.origin.y)),
          },
          size: {
            width:
              Math.max(...rects.map((r) => r.origin.x + r.size.width)) -
              Math.min(...rects.map((r) => r.origin.x)),
            height:
              Math.max(...rects.map((r) => r.origin.y + r.size.height)) -
              Math.min(...rects.map((r) => r.origin.y)),
          },
        };
        if(type=='highlight'){
          annotation.createAnnotation(pageIndex, {
            id: `highlight-${Date.now()}-${pageIndex}`,
            type: PdfAnnotationSubtype.HIGHLIGHT,
            pageIndex,
            rect: boundingRect,
            segmentRects: rects,
            color: "#FFFF00",
            opacity: 0.5,
          });
        }
        else if(type=='underline'){
          annotation.createAnnotation(pageIndex, {
            id: `underline-${Date.now()}-${pageIndex}`,
            type: PdfAnnotationSubtype.UNDERLINE,
            pageIndex,
            rect: boundingRect,
            segmentRects: rects,
            color: "black",
            opacity: 1,
          });
        } else if(type=='strikethrough'){
          annotation.createAnnotation(pageIndex, {
            id: `strikethrough-${Date.now()}-${pageIndex}`,
            type: PdfAnnotationSubtype.STRIKEOUT,
            pageIndex,
            rect: boundingRect,
            segmentRects: rects,
            color: "red",
            opacity: 1,
          }); 
        }
      }
      selection.clear();
      console.log("Highlight applied successfully");
    } catch (err) {
      console.error("Error applying highlight:", err);
    }
  };

  return (
    <div style={{display:'flex', gap: 4}}>
      <ToggleIconButton isOpen={false} onClick={()=>annotateSelection('highlight')}><BorderColorOutlinedIcon/></ToggleIconButton>
      <ToggleIconButton isOpen={false} onClick={()=>annotateSelection('underline')}><FormatUnderlinedOutlinedIcon/></ToggleIconButton>
      <ToggleIconButton isOpen={false} onClick={()=>annotateSelection('strikethrough')}><StrikethroughSOutlinedIcon/></ToggleIconButton>
      <DeleteAnnotation/>
    </div>
  );
};
