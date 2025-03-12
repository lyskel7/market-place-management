import { create } from 'zustand';
import { ICategory } from '../interfaces';

interface ICategoryStore {
  editedCategory: Partial<ICategory> | null;
  selectedCategory: Partial<ICategory> | null;
  categories: ICategory[];
  sRefetch: VoidFunction;
  onEdit: (editCategory: Partial<ICategory> | null) => void;
  onSelect: (selectCategory: Partial<ICategory> | null) => void;
  // onRefetch: () => Promise<QueryObserverResult<InfiniteData<IPaginatedResult<ICategory>, unknown>,Error>>;
  onRefetch: (refetch: VoidFunction) => void;
  setCategories: (items: ICategory[]) => void;
}

export const useCategoryStore = create<ICategoryStore>((set) => ({
  editedCategory: null,
  selectedCategory: null,
  categories: [],
  sRefetch: () => undefined,
  onEdit: (editCategory: Partial<ICategory> | null) =>
    set({ editedCategory: editCategory }),
  onSelect: (selectCategory: Partial<ICategory> | null) =>
    set({ selectedCategory: selectCategory }),
  setCategories: (items: ICategory[]) => set({ categories: items }),
  onRefetch: (refetch: VoidFunction) => set({ sRefetch: refetch }),
}));
