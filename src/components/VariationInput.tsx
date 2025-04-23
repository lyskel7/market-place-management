import { ETypes, EVarAttr } from '@/lib/enums';
import useUpdateVarAttr from '@/lib/hooks/useUpdateVarAttr';
import { ICategory } from '@/lib/interfaces';
import { useCategoryStore } from '@/lib/stores/categoryStore';
import { Button, Stack, TextField, Tooltip } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';

const VariationInput = ({ varOrAttr }: { varOrAttr: EVarAttr }) => {
  const [field, setField] = useState('');
  const { category, subcategory } = useCategoryStore(
    useShallow((state) => ({
      category: state.catAutocomplete,
      subcategory: state.selSubc,
    })),
  );
  const { mutate, isPending } = useUpdateVarAttr(category, setField);

  const handleAddVariation = () => {
    let newValues: string[] = [];

    if (!field) {
      toast.warning('You need fill out the field');
      return;
    }
    if (!category) {
      toast.warning('Select a category');
      return;
    }
    if (!subcategory) {
      toast.warning('Select a subcategory');
      return;
    }

    const oldValues = subcategory[varOrAttr] as Array<string>;

    const enteredValues = field
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

    const diffValues = enteredValues.filter((v) => !oldValues?.includes(v));

    if (!diffValues.length) {
      toast.error('These variations exist, choose others names');
      return;
    }

    if (diffValues.length && diffValues.length < enteredValues.length) {
      toast.warning(
        'Some variations were not inserted because they already exist. Check them out',
      );
      return;
    }

    newValues = oldValues ? [...diffValues, ...oldValues] : diffValues;

    const itemsToUpdate: Partial<ICategory> = {
      pk: ETypes.SUBCATEGORY,
      sk: subcategory.sk,
      [varOrAttr]: newValues.sort(),
    };

    mutate(itemsToUpdate);
  };

  return (
    <Stack direction={'row'}>
      <Tooltip
        title="Type variation name one or many separated by comma"
        arrow
      >
        <TextField
          fullWidth
          id={'itemName'}
          placeholder={'One or many variation by comma'}
          variant="outlined"
          value={field}
          onChange={(e) => setField(e.target.value)}
          size="small"
          disabled={isPending}
          slotProps={{
            htmlInput: {
              maxLength: 30,
            },
          }}
        />
      </Tooltip>
      <Button
        onClick={handleAddVariation}
        disabled={isPending}
      >
        {isPending ? 'Adding...' : 'Add'}
      </Button>
    </Stack>
  );
};

export default VariationInput;
