import { ExperienceTemplateGallery } from "../components/experience/ExperienceTemplateGallery";

export function TemplateGalleryDebug() {
  return (
    <div className="min-h-screen bg-black p-6">
      <ExperienceTemplateGallery activeId="gridiron" onApply={() => {}} />
    </div>
  );
}
