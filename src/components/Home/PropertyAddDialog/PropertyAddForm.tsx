import {Property} from "@/types/listing";
import {Autocomplete, Checkbox, FormControlLabel, TextField, Grid, Typography} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import useIsDesktopScreen from "@/hooks/useIsDesktopScreen";
import {Control, Controller, UseFormRegister} from "react-hook-form";
import * as React from "react";
import {getVirtualizedAutocompleteConfig} from "@/utils/autocompleteVirtualizationUtils";
import {usePropertyOptions} from "@/hooks/usePropertyOptions";
import useGetAllListings from "@/hooks/useGetAllListings";
import {SkuInput} from "./SkuInput";
import dayjs from "dayjs";

interface PropertyAddFormProps {
    register: UseFormRegister<Property>;
    control: Control<Property, Property>;
    property: Property;
}

export const PropertyAddForm = ({control, register}: PropertyAddFormProps) => {
    const isDesktopScreen = useIsDesktopScreen();
    const {data} = useGetAllListings();
    const size = isDesktopScreen ? "medium" : "small";
    const {
        projectNameOptions,
        propertyTypeOptions,
        postFromTypeOptions,
        areaLPOptions,
        areaLVOptions,
        postTypeOptions,
        facingDirectionOptions,
        bedroomOptions,
        bathroomOptions,
        availabilityOptions
    } = usePropertyOptions(data || []);

    return (
        <Grid container spacing={3}>
            {/* PROPERTY INFORMATION SECTION */}
            <Grid size={12}>
                <Typography fontWeight={500} color="primary">
                    Property Information
                </Typography>
            </Grid>

            {/* Area LP */}
            <Grid size={{xs: 12, sm: 6}}>
                <Controller
                    name="areaLP"
                    control={control}
                    render={({field: {onChange, ...field}}) => (
                        <Autocomplete
                            {...field}
                            size={size}
                            freeSolo
                            options={areaLPOptions}
                            renderInput={(params) => (
                                <TextField {...params} label="Area LP" placeholder="Area LP"/>
                            )}
                            onChange={(e, data) => onChange(data)}
                            onKeyUp={(event) => onChange((event.target as any).value)}
                        />
                    )}
                />
            </Grid>

            {/* Area LV */}
            <Grid size={{xs: 12, sm: 6}}>
                <Controller
                    name="areaLV"
                    control={control}
                    render={({field: {onChange, value, ...field}}) => {
                        // Convert comma-separated string to array for display
                        const currentValues = value ? value.split(',').map(v => v.trim()).filter(Boolean) : [];

                        return (
                            <Autocomplete
                                {...field}
                                multiple
                                freeSolo
                                size={size}
                                options={areaLVOptions}
                                value={currentValues}
                                renderInput={(params) => (
                                    <TextField {...params} label="Area Group" placeholder="Area Group"/>
                                )
                                }
                                onChange={(e, newValue) => {
                                    // Convert array back to comma-separated string with proper formatting
                                    const formattedValue = newValue.join(', ');
                                    onChange(formattedValue);
                                }}
                            />
                        );
                    }}
                />
            </Grid>

            {/* SKU */}
            <Grid size={12}>
                <SkuInput control={control} size={size} required={true}/>
            </Grid>

            {/* Property Type */}
            <Grid size={{xs: 12, sm: 6}}>
                <Controller
                    name="propertyType"
                    control={control}
                    render={({field: {onChange, ...field}}) => (
                        <Autocomplete
                            {...field}
                            size={size}
                            options={propertyTypeOptions}
                            renderInput={(params) => (
                                <TextField {...params} label="Property Type" placeholder="Property Type" required/>
                            )}
                            onChange={(e, data) => onChange(data)}
                        />
                    )}
                />
            </Grid>

            {/* Post Type */}
            <Grid size={{xs: 12, sm: 6}}>
                <Controller
                    name="postType"
                    control={control}
                    render={({field: {onChange, ...field}}) => (
                        <Autocomplete
                            {...field}
                            size={size}
                            options={postTypeOptions}
                            renderInput={(params) => (
                                <TextField {...params} label="Post Type" placeholder="Post Type" required/>
                            )}
                            onChange={(e, data) => onChange(data)}
                        />
                    )}
                />
            </Grid>

            {/* Post From */}
            <Grid size={{xs: 12, sm: 6}}>
                <Controller
                    name="postFrom"
                    control={control}
                    render={({field: {onChange, ...field}}) => (
                        <Autocomplete
                            {...field}
                            size={size}
                            options={postFromTypeOptions}
                            renderInput={(params) => (
                                <TextField {...params} label="Post From" placeholder="Post From"/>
                            )}
                            onChange={(e, data) => onChange(data)}
                        />
                    )}
                />
            </Grid>

            {/* Title EN */}
            <Grid size={{xs: 12, sm: 6}}>
                <Controller
                    name="titleEN"
                    control={control}
                    render={({field: {onChange, ...field}}) => (
                        <Autocomplete
                            {...field}
                            {...getVirtualizedAutocompleteConfig()}
                            disableCloseOnSelect
                            size={size}
                            freeSolo
                            renderOption={(props, option, state) =>
                                [props, option, state.index] as React.ReactNode
                            }
                            options={projectNameOptions}
                            renderInput={(params) => (
                                <TextField {...params} label="Title EN" placeholder="Title EN"/>
                            )}
                            onChange={(e, data) => onChange(data)}
                            onKeyUp={(event) => onChange((event.target as any).value)}
                        />
                    )}
                />
            </Grid>

            {/* Price */}
            <Grid size={{xs: 12, sm: 6}}>
                <TextField {...register("price", {valueAsNumber: true})}
                           type="number"
                           label="Price"
                           variant="outlined"
                           size={size}
                           fullWidth/>
            </Grid>

            {/* Area Size */}
            <Grid size={{xs: 12, sm: 6}}>
                <TextField {...register("areaSize", {valueAsNumber: true})}
                           type="number"
                           label="Area Size"
                           variant="outlined"
                           size={size}
                           fullWidth
                           slotProps={{htmlInput: {step: "any"}}}/>
            </Grid>

            {/* Floor */}
            <Grid size={{xs: 12, sm: 6}}>
                <TextField {...register("floor")}
                           label="Floor"
                           variant="outlined"
                           size={size}
                           fullWidth/>
            </Grid>

            {/* Bedroom */}
            <Grid size={{xs: 12, sm: 6}}>
                <Controller
                    name="bedroom"
                    control={control}
                    render={({field: {onChange, ...field}}) => (
                        <Autocomplete
                            {...field}
                            size={size}
                            options={bedroomOptions}
                            renderInput={(params) => (
                                <TextField {...params} label="Bedroom" placeholder="Select Bedroom"/>
                            )}
                            onChange={(e, data) => onChange(data)}
                        />
                    )}
                />
            </Grid>

            {/* Bathroom */}
            <Grid size={{xs: 12, sm: 6}}>
                <Controller
                    name="bathroom"
                    control={control}
                    render={({field: {onChange, ...field}}) => (
                        <Autocomplete
                            {...field}
                            size={size}
                            options={bathroomOptions}
                            renderInput={(params) => (
                                <TextField {...params} label="Bathroom" placeholder="Select Bathroom"/>
                            )}
                            onChange={(e, data) => onChange(data)}
                        />
                    )}
                />
            </Grid>

            {/* Facing Direction */}
            <Grid size={{xs: 12, sm: 6}}>
                <Controller
                    name="facingDirection"
                    control={control}
                    render={({field: {onChange, ...field}}) => (
                        <Autocomplete
                            {...field}
                            size={size}
                            options={facingDirectionOptions}
                            renderInput={(params) => (
                                <TextField {...params} label="Facing Direction" placeholder="Select Facing Direction"/>
                            )}
                            onChange={(e, data) => onChange(data)}
                        />
                    )}
                />
            </Grid>

            {/* Unit Number */}
            <Grid size={{xs: 12, sm: 6}}>
                <TextField {...register("unitNumber")}
                           label="Unit Number"
                           variant="outlined"
                           size={size}
                           fullWidth/>
            </Grid>

            {/* Building Year */}
            <Grid size={{xs: 12, sm: 6}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                        name="buildingYear"
                        control={control}
                        render={({field: {onChange, value, ...field}}) => (
                            <DatePicker
                                {...field}
                                label="Building Year"
                                views={['year']}
                                value={value ? dayjs().year(value) : null}
                                onChange={(newValue) => {
                                    onChange(newValue ? newValue.year() : null);
                                }}
                                slotProps={{
                                    textField: {
                                        size: size,
                                        fullWidth: true,
                                        variant: "outlined"
                                    }
                                }}
                            />
                        )}
                    />
                </LocalizationProvider>
            </Grid>

            {/* CONTACT INFORMATION SECTION */}
            <Grid size={12}>
                <Typography fontWeight={500} color="primary">
                    Contact Information
                </Typography>
            </Grid>

            {/* Name */}
            <Grid size={{xs: 12, sm: 6}}>
                <TextField {...register("name")}
                           label="Name"
                           variant="outlined"
                           size={size}
                           fullWidth/>
            </Grid>

            {/* Email */}
            <Grid size={{xs: 12, sm: 6}}>
                <TextField {...register("email")}
                           type="email"
                           label="Email"
                           variant="outlined"
                           size={size}
                           fullWidth/>
            </Grid>

            {/* Tel */}
            <Grid size={{xs: 12, sm: 6}}>
                <TextField {...register("tel")}
                           label="Tel."
                           variant="outlined"
                           size={size}
                           fullWidth/>
            </Grid>

            {/* Line ID */}
            <Grid size={{xs: 12, sm: 6}}>
                <TextField {...register("lineId")}
                           label="Line ID"
                           variant="outlined"
                           size={size}
                           fullWidth/>
            </Grid>

            {/* Whatsapp */}
            <Grid size={{xs: 12, sm: 6}}>
                <TextField {...register("whatsapp")}
                           label="Whatsapp"
                           variant="outlined"
                           size={size}
                           fullWidth/>
            </Grid>

            {/* Facebook Messenger */}
            <Grid size={{xs: 12, sm: 6}}>
                <TextField {...register("facebookMessenger")}
                           label="Facebook Messenger"
                           variant="outlined"
                           size={size}
                           fullWidth/>
            </Grid>

            {/* Wechat */}
            <Grid size={{xs: 12, sm: 6}}>
                <TextField {...register("wechat")}
                           label="Wechat"
                           variant="outlined"
                           size={size}
                           fullWidth/>
            </Grid>

            {/* ADDITIONAL DETAILS SECTION */}
            <Grid size={12}>
                <Typography fontWeight={500} color="primary">
                    Additional Details
                </Typography>
            </Grid>

            {/* Availability */}
            <Grid size={{xs: 12, sm: 6}}>
                <Controller
                    name="availability"
                    control={control}
                    render={({field: {onChange, ...field}}) => (
                        <Autocomplete
                            {...field}
                            size={size}
                            options={availabilityOptions}
                            renderInput={(params) => (
                                <TextField {...params} label="Availability" placeholder="Select Availability"/>
                            )}
                            onChange={(e, data) => onChange(data)}
                        />
                    )}
                />
            </Grid>

            {/* Listed On */}
            <Grid size={{xs: 12, sm: 6}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                        name="listedOn"
                        control={control}
                        render={({field: {onChange, value, ...field}}) => (
                            <DatePicker
                                {...field}
                                label="Listed On"
                                value={value ? dayjs(value) : null}
                                onChange={(newValue) => {
                                    onChange(newValue ? newValue.format('YYYY-MM-DD') : '');
                                }}
                                slotProps={{
                                    textField: {
                                        size: size,
                                        fullWidth: true,
                                        variant: "outlined"
                                    }
                                }}
                            />
                        )}
                    />
                </LocalizationProvider>
            </Grid>

            {/* External Data Source */}
            <Grid size={{xs: 12, sm: 6}}>
                <TextField {...register("externalDataSource")}
                           label="External Data Source"
                           variant="outlined"
                           size={size}
                           fullWidth/>
            </Grid>

            {/* Comment */}
            <Grid size={12}>
                <TextField {...register("comment")}
                           label="Comment"
                           variant="outlined"
                           size={size}
                           fullWidth
                           multiline
                           rows={3}/>
            </Grid>

            {/* Pet Allowed */}
            <Grid size={{xs: 6}} className="flex items-center">
                <Controller
                    name="petAllowed"
                    control={control}
                    render={({field: {onChange, value, ...field}}) => (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    {...field}
                                    checked={!!value || value === "Allow"}
                                    onChange={event => onChange(event.target.checked ? "Allow" : "")}
                                />
                            }
                            label="Pet Allowed"
                        />
                    )}
                />
            </Grid>

            {/* Exclusive */}
            <Grid size={{xs: 6}} className="flex items-center">
                <Controller
                    name="exclusive"
                    control={control}
                    render={({field: {onChange, value, ...field}}) => (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    {...field}
                                    checked={!!value || value === "Exclusive"}
                                    onChange={event => onChange(event.target.checked ? "Exclusive" : "")}
                                />
                            }
                            label="Exclusive"
                        />
                    )}
                />
            </Grid>
        </Grid>
    );
};
