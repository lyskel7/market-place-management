// 'use client';
// import { deleteItems, updateItem } from '@/lib/apis/db';
// import useResponsive from '@/lib/hooks/useResponsive';
// import { ETypes, ICategory } from '@/lib/interfaces';
// import { useUpdatedCategoryStore } from '@/lib/stores';
// import { extractIdFromDynamoDBKey } from '@/utils';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import ExpandLess from '@mui/icons-material/ExpandLess';
// import ExpandMore from '@mui/icons-material/ExpandMore';
// import {
//   Box,
//   Button,
//   Collapse,
//   IconButton,
//   List,
//   ListItem,
//   ListItemText,
//   Switch,
//   Tooltip,
// } from '@mui/material';
// import { useRouter } from 'next/navigation';
// import { ChangeEvent, useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import { useShallow } from 'zustand/react/shallow';
// import ConfirmationDialog from '../common/Snackbar';

// type TProps = {
//   subcategory: ICategory;
// };

// const SubcategoryComp = (props: TProps) => {
//   const { subcategory } = props;
//   const {
//     PK,
//     SK,
//     subcategory: subcategory_name,
//     subcategory_desc,
//     hidden,
//   } = subcategory;
//   const { isMobile } = useResponsive();
//   const [checked, setChecked] = useState(hidden);
//   const [open, setOpen] = useState(false);
//   const router = useRouter();
//   const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
//   const editCategory = useUpdatedCategoryStore(
//     useShallow((state) => state.onEdit),
//   );

//   const handleClick = () => {
//     setOpen(!open);
//   };

//   const handleOnChangeChecked = async ({
//     target: { checked },
//   }: ChangeEvent<HTMLInputElement>) => {
//     setChecked(checked);
//     try {
//       const updatedCategory: Partial<ICategory> = {
//         PK,
//         SK,
//         hidden: checked,
//       };
//       console.log(updatedCategory);
//       await updateItem(updatedCategory);
//       router.refresh();
//     } catch (error) {
//       console.debug('Category could not be updated', error);
//       toast.error(`Category could not be updated`);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await deleteItems(ETypes.CATEGORY, extractIdFromDynamoDBKey(PK));
//       toast.success('Category removed');
//       router.refresh();
//     } catch (error) {
//       console.debug('Error while deleting: ', error);
//       toast.error('Error while deleting. Try later');
//     }
//   };

//   const handleConfirmDelete = () => {
//     setOpenConfirmationDialog(true);
//   };

//   const handleSetUpdateCategory = () => {
//     editCategory(subcategory);
//   };

//   useEffect(() => {
//     if (!isMobile) {
//       setOpen(false);
//     }
//   }, [isMobile]);

//   return (
//     <>
//       <ConfirmationDialog
//         title="Removing"
//         message="Are you sure to remove the category?"
//         open={openConfirmationDialog}
//         onOpen={setOpenConfirmationDialog}
//         onAccept={handleDelete}
//       />
//       <ListItem
//         key={PK}
//         secondaryAction={
//           isMobile ? (
//             open ? (
//               <IconButton onClick={handleClick}>
//                 <ExpandLess />
//               </IconButton>
//             ) : (
//               <IconButton onClick={handleClick}>
//                 <ExpandMore />
//               </IconButton>
//             )
//           ) : (
//             <Box
//               gap={1}
//               display={'flex'}
//               justifyContent={'space-between'}
//               alignItems={'center'}
//             >
//               <Tooltip
//                 title={hidden ? 'Hidden' : 'Unhidden'}
//                 placement="left-end"
//                 arrow
//               >
//                 <Switch
//                   id={`switch-hidden-${PK}`}
//                   checked={checked}
//                   onChange={handleOnChangeChecked}
//                 />
//               </Tooltip>

//               <Tooltip
//                 title={'Edit'}
//                 placement="top"
//                 arrow
//               >
//                 <IconButton
//                   edge="end"
//                   aria-label="delete"
//                   onClick={handleSetUpdateCategory}
//                 >
//                   <EditIcon />
//                 </IconButton>
//               </Tooltip>

//               <Tooltip
//                 title={'Delete'}
//                 placement="top"
//                 arrow
//               >
//                 <IconButton
//                   onClick={handleConfirmDelete}
//                   edge="end"
//                   aria-label="delete"
//                 >
//                   <DeleteIcon />
//                 </IconButton>
//               </Tooltip>
//             </Box>
//           )
//         }
//       >
//         <ListItemText
//           primary={subcategory_name}
//           secondary={subcategory_desc}
//         />
//       </ListItem>
//       <Collapse
//         in={open}
//         timeout="auto"
//         unmountOnExit
//       >
//         <List
//           component="div"
//           disablePadding
//         >
//           <ListItem sx={{ pl: 4 }}>
//             <Switch checked={false} />
//             <Button startIcon={<EditIcon />}>Edit</Button>
//             <Button
//               startIcon={<DeleteIcon />}
//               onClick={handleConfirmDelete}
//             >
//               Delete
//             </Button>
//           </ListItem>
//         </List>
//       </Collapse>
//     </>
//   );
// };

// export default SubcategoryComp;
