// app/admin/roadmaps/components/RoadmapSection.tsx
import { Roadmap } from "@/types/roadmap/index";
import { Category } from "@/types/category/index";
import BaseCard from "@/components/card/BaseCard";

type Props = {
  category: Category;
  roadmaps: Roadmap[];
  onDelete: (id: string) => void;
};

const RoadmapSection = ({ category, roadmaps, onDelete }: Props) => {
  return (
    <div key={category.id} className="mb-8">
      <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
        {category.name}
      </h3>
      {roadmaps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {roadmaps.map((r) => (
            <BaseCard
              key={r.id}
              id={r.id}
              name={r.name}
              description={r.description}
              onDelete={onDelete}
              editUrl={`roadmaps/${r.id}/edit`}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-4">Không có roadmap trong danh mục này.</p>
      )}
    </div>
  );
};

export default RoadmapSection;
