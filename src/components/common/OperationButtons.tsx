// import AddIcon from '@mui/icons-material/Add';
// import CheckIcon from '@mui/icons-material/Check';
// import ClearIcon from '@mui/icons-material/Clear';
// import { Box, IconButton } from '@mui/material';
// import { Dispatch, SetStateAction } from 'react';
// import { TOperation } from '../dashboard/CategoriesDash';

// type TOperationButtonsProps = {
//   onAdd: VoidFunction,
//   onEdit: VoidFunction,
//   onClear: VoidFunction,
//   operation: TOperation,
//   onOperation: Dispatch<SetStateAction<TOperation>>,
// }

// const OperationButtons = (props: TOperationButtonsProps) => {
//   const { onAdd, onEdit, onClear, operation, onOperation } = props;

//   const handleAdd = () => {
//     onAdd();
//   }

//   const handleEdit = () => {
//     onEdit();
//     onOperation('add');
//   }

//   const handleClear = () => {
//     onOperation('add');
//     onClear();
//   }

//   return (
//     <Box
//       height={1}
//       display={'flex'}
//       justifyContent={'space-between'}
//       alignItems={'center'}
//     >
//       {
//         operation === 'add' ?
//           <IconButton
//             sx={{ width: 50, height: 50 }}
//             onClick={handleAdd}
//           >
//             <AddIcon />
//           </IconButton>
//           :
//           <>
//             <IconButton
//               sx={{ width: 50, height: 50 }}
//               onClick={handleEdit}
//             >
//               <CheckIcon />
//             </IconButton>
//           </>
//       }
//       <IconButton
//         sx={{ width: 50, height: 50 }}
//         onClick={handleClear}
//       >
//         <ClearIcon />
//       </IconButton>
//     </Box>
//   );
// }

// export default OperationButtons
