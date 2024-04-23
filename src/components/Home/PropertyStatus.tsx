import {Autocomplete, Stack, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/system/Unstable_Grid";
import * as React from "react";
import {useState} from "react";
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
import {getAvailableFromPsCode} from "@/services/psApi";

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
    const [isFetchLoading, setIsFetchLoading] = useState<boolean>(false);
    const [summitFromValue, setSummitFromValue] = useState<FormValues>({
        comment: property.comment,
        availability: property.availability
    });
    const {enqueueSnackbar} = useSnackbar();
    const {control, handleSubmit, reset, setValue} = useForm<FormValues>({
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

    const clickFetchHandler = async () => {
        try {
            setIsFetchLoading(true);
            const response = await getAvailableFromPsCode(property.psCode);
            setValue("availability", response.availability);
            setValue("comment", response.comment);
            enqueueSnackbar("Fetch availability", {variant: "success"});
        } catch (e) {
            enqueueSnackbar("Error fetch Availability", {variant: "error"});
        } finally {
            setIsFetchLoading(false);
        }
    };

    return (
        <Grid component="form" className={"max-w-[calc(100vw-48px)] md:max-w-[600px]"}
              onSubmit={handleSubmit(onSubmit)}
              container spacing={2}>
            <Grid xs={12}>
                <Controller
                    name="availability"
                    control={control}
                    render={({field: {onChange, ...field}}) => (
                        <Autocomplete
                            {...field}
                            size={size}
                            options={availableOptions}
                            renderInput={({inputProps, ...rest}) => (
                                <TextField {...rest} label="Availability" inputProps={{...inputProps, readOnly}}/>
                            )}
                            onChange={(e, data) => onChange(data)}
                        />
                    )}
                />
            </Grid>
            <Grid xs={12}>
                <Typography>
                    Update Availability: {updateAvailabilityText}
                </Typography>
            </Grid>
            <Grid xs={12}>
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
            <Grid xs={12}>
                <Stack spacing={2} direction="row" justifyContent={property.psCode ? "space-between" : "end"}>
                    {property.psCode && (
                        <LoadingButton loading={isFetchLoading} onClick={clickFetchHandler}
                                       variant="contained">Refresh</LoadingButton>
                    )}
                    <Stack spacing={2} direction="row" justifyContent={"end"}>
                        <Button disabled={isLoading} variant="outlined" onClick={resetHandler}>Reset</Button>
                        <LoadingButton loading={isLoading} type={"submit"} variant="contained">Save</LoadingButton>
                    </Stack>
                </Stack>
            </Grid>
        </Grid>
    );
};
