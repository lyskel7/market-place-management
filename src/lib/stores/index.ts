import { create } from 'zustand';
import { ICategory } from '../interfaces';

interface ICategoryStore {
  selCat: Partial<ICategory> | null;
  selAutocomplete: Partial<ICategory> | null;
  categories: ICategory[];
  isUpdating: boolean;
  onSelCat: (cat: Partial<ICategory> | null) => void;
  onSelAutocomplete: (subc: Partial<ICategory> | null) => void;
  setIsUpdating: (updating: boolean) => void;
  setCategories: (items: ICategory[]) => void;
}

export const useCategoryStore = create<ICategoryStore>((set) => ({
  selCat: null,
  selAutocomplete: null,
  categories: [],
  isUpdating: false,
  itemsTotaInDB: 0,
  onSelCat: (item: Partial<ICategory> | null) => set({ selCat: item }),
  onSelAutocomplete: (item: Partial<ICategory> | null) =>
    set({ selAutocomplete: item }),
  setIsUpdating: (updating: boolean) => set({ isUpdating: updating }),
  setCategories: (items: ICategory[]) => set({ categories: items }),
}));
