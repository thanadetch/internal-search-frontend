import {Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from "@mui/material";
import {Property} from "@/types/listing";
import useIsDesktopScreen from "@/hooks/useIsDesktopScreen";
import * as React from "react";
import {Dispatch, SetStateAction, useState} from "react";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import {deleteListing} from "@/services/listingsApi";
import {enqueueSnackbar} from "notistack";
import {deleteOldCache} from "@/utils/propertyUtils";
import {useQueryClient} from "@tanstack/react-query";
import {LoadingButton} from "@mui/lab";

interface PropertyFormDialog {
    property: Property;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DeleteDialog = ({property, open, setOpen}: PropertyFormDialog) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const queryClient = useQueryClient();
    const isDesktopScreen = useIsDesktopScreen();

    const handleClose = () => {
        setOpen(false);
    };

    const clickConfirm = async () => {
        try {
            setIsLoading(true);
            await deleteListing(property.postType, property.sku);
            deleteOldCache(queryClient, property.sku, property.postType);
            enqueueSnackbar("Delete successfully", {variant: "success", autoHideDuration: 3000});
            setOpen(false);
        } catch (e) {
            enqueueSnackbar("Error delete data", {variant: "error"});
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            scroll={"paper"}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <div className={"flex flex-row justify-between items-center"}>
                <DialogTitle id="responsive-dialog-title">
                    Delete Property - {property?.sku}/{property?.postType}
                </DialogTitle>
                <div className={"pr-2"}>
                    <IconButton aria-label="close" onClick={handleClose}>
                        <CloseIcon/>
                    </IconButton>
                </div>
            </div>

            <DialogContent dividers>
                Are you sure you want to delete this property?
            </DialogContent>
            <DialogActions>
                <Button disabled={isLoading} onClick={handleClose} variant="outlined">Cancel</Button>
                <LoadingButton loading={isLoading} onClick={() => clickConfirm()} variant="contained">
                    Confirm
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};
