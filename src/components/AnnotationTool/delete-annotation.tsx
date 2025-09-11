import { useAnnotationCapability } from "@embedpdf/plugin-annotation/react";
import { MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { ToggleIconButton } from "../toggle-icon-button";
export const DeleteAnnotation = () => {
  const { provides: annotation } = useAnnotationCapability();
  const [selected, setSelected] = useState<{ id: string; pageIndex: number } | null>(null);

  useEffect(() => {
    if (!annotation) return;

    const interval = setInterval(() => {
      const tracked = annotation.getSelectedAnnotation();
      if (tracked) {
        setSelected({
          id: tracked.object.id,
          pageIndex: tracked.object.pageIndex,
        });
      } else {
        setSelected(null);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [annotation]);

  const deleteSelected = () => {
    if (selected) {
      annotation?.deleteAnnotation(selected.pageIndex, selected.id);
      setSelected(null);
    }
  };

  return (
    <div>
      {selected && (
        <ToggleIconButton isOpen={false} onClick={deleteSelected}>
            <DeleteOutlineOutlinedIcon/>
        </ToggleIconButton>
      )}
    </div>
  );
};
