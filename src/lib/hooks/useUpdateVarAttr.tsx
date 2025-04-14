import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { updateItem } from '../apis/db';
import { ETypes } from '../enums';
import { ICategory } from '../interfaces';
import { Dispatch, SetStateAction } from 'react';

const useUpdateVarAttr = (
  category: Partial<ICategory> | null,
  setCleanField?: Dispatch<SetStateAction<string>>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedData: Partial<ICategory>) =>
      updateItem<Partial<ICategory>>(updatedData),
    onSuccess: (variables) => {
      toast.success('Variations updated successfully');
      console.group(`Variations updated successfully`);
      console.log('variables: ', variables);
      console.groupEnd();
      if (setCleanField) {
        setCleanField('');
      }

      if (category?.sk) {
        const queryKeyToInvalidate = [ETypes.VARIATIONS, category.sk];
        queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
      } else {
        console.warn(
          'Failed invalidate query: category.sk is not defined onSuccess',
        );
      }
    },
    onError: (error) => {
      console.error('Mutation failed:', error);
      toast.error('Variations could not be updated. Please try again.');
    },
  });
};

export default useUpdateVarAttr;
