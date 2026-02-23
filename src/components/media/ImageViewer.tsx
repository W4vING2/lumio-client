import { Modal } from "@/components/ui/Modal";

export const ImageViewer = ({ open, src, onClose }: { open: boolean; src: string | null; onClose: () => void }): JSX.Element => (
  <Modal open={open} onClose={onClose}>
    {src ? <img src={src} alt="preview" className="max-h-[80vh] w-full rounded-xl object-contain" /> : null}
  </Modal>
);
