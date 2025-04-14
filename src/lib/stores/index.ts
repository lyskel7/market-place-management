import { create } from 'zustand';
import { ICategory } from '../interfaces';

interface ICategoryStore {
  itemForEdit: Partial<ICategory> | null;
  catAutocomplete: Partial<ICategory> | null;
  selSubc: Partial<ICategory> | null;
  listedItems: ICategory[];
  isUpdating: boolean;
  setItemForEdit: (item: Partial<ICategory> | null) => void;
  setCatAutocomplete: (subc: Partial<ICategory> | null) => void;
  setIsUpdating: (updating: boolean) => void;
  setListedItems: (items: ICategory[]) => void;
  setSelSubc: (subc: Partial<ICategory> | null) => void;
}

export const useCategoryStore = create<ICategoryStore>((set) => ({
  itemForEdit: null,
  catAutocomplete: null,
  listedItems: [],
  isUpdating: false,
  itemsTotaInDB: 0,
  selSubc: null,
  setItemForEdit: (item: Partial<ICategory> | null) =>
    set({ itemForEdit: item }),
  setCatAutocomplete: (item: Partial<ICategory> | null) =>
    set({ catAutocomplete: item }),
  setIsUpdating: (updating: boolean) => set({ isUpdating: updating }),
  setListedItems: (items: ICategory[]) => set({ listedItems: items }),
  setSelSubc: (subc: Partial<ICategory> | null) => set({ selSubc: subc }),
}));
