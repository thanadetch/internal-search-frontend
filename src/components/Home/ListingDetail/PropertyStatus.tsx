import {Autocomplete, Stack, TextField, Grid} from "@mui/material";
import Button from "@mui/material/Button";
import * as React from "react";
import {useEffect, useState} from "react";
import {Property} from "@/types/listing";
import {Controller, useForm} from "react-hook-form";
import {updateListing} from "@/services/listingsApi";
import {useSnackbar} from "notistack";
import {LoadingButton} from "@mui/lab";
import {AvailabilityType} from "@/types/availability";
import dayjs from "dayjs";
import Typography from "@mui/material/Typography";
import {useQueryClient} from "@tanstack/react-query";
import useIsDesktopScreen from "@/hooks/useIsDesktopScreen";
import {updateOldCache} from "@/utils/propertyUtils";

interface PropertyCommentProps {
    property: Property;
}

interface FormValues {
    comment: string;
    availability: AvailabilityType;
}

export const PropertyStatus = ({property}: PropertyCommentProps) => {
    const isDesktopScreen = useIsDesktopScreen();
    const readOnly = !isDesktopScreen;
    const size = isDesktopScreen ? "medium" : "small";
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [summitFromValue, setSummitFromValue] = useState<FormValues>({
        comment: property.comment,
        availability: property.availability
    });
    const {enqueueSnackbar} = useSnackbar();
    const {control, handleSubmit, reset} = useForm<FormValues>({
        defaultValues: {
            comment: property.comment,
            availability: property.availability
        }
    });
    const availableOptions = Object.values(AvailabilityType);
    const updateAvailabilityText = property.updateAvailability ? dayjs(property.updateAvailability)?.format("DD/MM/YYYY HH:mm:ss") : "-";

    const resetHandler = () => {
        reset({
            comment: summitFromValue?.comment,
            availability: summitFromValue?.availability
        });
    };

    const onSubmit = async (data: FormValues) => {
        try {
            setIsLoading(true);
            const response = await updateListing(property.postType, property.sku, data);
            setSummitFromValue(data);
            updateOldCache(queryClient, response);
            enqueueSnackbar("Comment updated", {variant: "success"});
        } catch (e) {
            enqueueSnackbar("Error updating comment", {variant: "error"});
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        reset({
            comment: property.comment,
            availability: property.availability
        })
    }, [property]);

    return (
        <Grid component="form" className={"max-w-[calc(100vw-48px)] md:max-w-[600px]"}
              onSubmit={handleSubmit(onSubmit)}
              container spacing={2}>
            <Grid size={12}>
                <Controller
                    name="availability"
                    control={control}
                    render={({field: {onChange, ...field}}) => (
                        <Autocomplete
                            {...field}
                            size={size}
                            options={availableOptions}
                            renderInput={({inputProps, ...rest}) => (
                                <TextField {...rest} label="Status" inputProps={{...inputProps, readOnly}}/>
                            )}
                            onChange={(e, data) => onChange(data)}
                        />
                    )}
                />
            </Grid>
            <Grid size={12}>
                <Typography>
                    Update Status: {updateAvailabilityText}
                </Typography>
            </Grid>
            <Grid size={12}>
                <Controller
                    name="comment"
                    control={control}
                    render={({field}) => (
                        <TextField {...field}
                                   rows={6}
                                   multiline
                                   size={size}
                                   label="Comments"
                                   variant="outlined"
                                   fullWidth/>
                    )}/>
            </Grid>
            <Grid size={12}>
                <Stack spacing={2} direction="row" justifyContent={"end"}>
                    <Button disabled={isLoading} variant="outlined" onClick={resetHandler}>Reset</Button>
                    <LoadingButton loading={isLoading} type={"submit"} variant="contained">Save</LoadingButton>
                </Stack>
            </Grid>
        </Grid>
    );
};
