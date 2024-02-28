import * as React from "react";
import {Accordion, AccordionDetails, AccordionSummary, Autocomplete, Box, Stack, TextField} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {SearchFormType} from "@/types/searchForm";
import {Property} from "@/types/listing";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/system/Unstable_Grid";
import {getVirtualizedAutocompleteConfig} from "@/utils/autocompleteVirtualizationUtils";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {PostType, PropertyType} from "@/constants/property";
import SearchIcon from "@mui/icons-material/Search";

interface SearchFormProps {
    properties: Property[];
    onSearch: (data: SearchFormType) => void;
}

export const SearchForm = ({properties, onSearch}: SearchFormProps) => {
    const {control, register, handleSubmit, setError, formState: {errors,}, trigger, reset} = useForm<SearchFormType>({
        defaultValues: {
            areaLPList: [],
            skuList: [],
            postTypeList: [],
            propertyTypeList: [],
            bathroomList: [],
            bedRoomList: [],
            projectNameList: [],
            minPrice: undefined,
            maxPrice: undefined,
            minAreaSize: undefined,
            maxAreaSize: undefined,
        }
    });
    const skuOptions: string[] = Array.from(new Set(properties?.map((property) => property.sku)) || []);
    const areaLPOptions: string[] = Array.from(new Set(properties?.map((property) => property.areaLP)) || []);
    const projectNameOptions: string[] = Array.from(new Set(properties?.map((property) => property.titleEN)) || []);
    const propertyTypeOptions: PropertyType[] = Object.values(PropertyType);
    const postTypeOptions: PostType[] = Object.values(PostType);
    const bedRoomOptions = ["Studio", ...new Array(10).fill(0).map((_, index) => (index + 1).toString())];
    const bathroomOptions = new Array(10).fill(0).map((_, index) => (index + 1).toString());

    const onSubmit = (data: SearchFormType) => {
        console.log(data);
        onSearch(data);
    };

    const resetHandler = () => {
        reset();
    };

    return (
        <Accordion defaultExpanded={true}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                <div className={"flex flex-row items-center gap-1"}>
                    <SearchIcon/>
                    <Typography variant="h6">
                        Search
                    </Typography>
                </div>
            </AccordionSummary>
            <AccordionDetails>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{mt: 1}}>
                    <Grid container spacing={2}>
                        <Grid xs={12}>
                            <Typography fontWeight={500}>
                                Property Information
                            </Typography>
                        </Grid>
                        <Grid xs={12} sm={6}>
                            <Controller
                                name="skuList"
                                control={control}
                                render={({field: {onChange, ...field}}) => (
                                    <Autocomplete
                                        {...field}
                                        {...getVirtualizedAutocompleteConfig()}
                                        multiple
                                        renderOption={(props, option, state) =>
                                            [props, option, state.index] as React.ReactNode
                                        }
                                        options={skuOptions}
                                        renderInput={(params) => (
                                            <TextField{...params} label="LP Code" placeholder="LP Code"/>
                                        )}
                                        onChange={(e, data) => onChange(data)}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid xs={12} sm={6}>
                            <Controller
                                name="propertyTypeList"
                                control={control}
                                render={({field: {onChange, ...field}}) => (
                                    <Autocomplete
                                        {...field}
                                        multiple
                                        options={propertyTypeOptions}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Property Type" placeholder="Property Type"/>
                                        )}
                                        onChange={(e, data) => onChange(data)}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid xs={12} sm={6}>
                            <Controller
                                name="projectNameList"
                                control={control}
                                render={({field: {onChange, ...field}}) => (
                                    <Autocomplete
                                        {...field}
                                        {...getVirtualizedAutocompleteConfig()}
                                        multiple
                                        renderOption={(props, option, state) =>
                                            [props, option, state.index] as React.ReactNode
                                        }
                                        options={projectNameOptions}
                                        renderInput={(params) => (
                                            <TextField{...params} label="Project Name" placeholder="Project Name"/>
                                        )}
                                        onChange={(e, data) => onChange(data)}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid xs={12} sm={6}>
                            <Controller
                                name="areaLPList"
                                control={control}
                                render={({field: {onChange, ...field}}) => (
                                    <Autocomplete
                                        {...field}
                                        multiple
                                        options={areaLPOptions}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Area LP" placeholder="Area LP"/>
                                        )}
                                        onChange={(e, data) => onChange(data)}
                                    />
                                )}
                            />
                        </Grid>


                        <Grid xs={12} sm={3}>
                            <Controller
                                name="postTypeList"
                                control={control}
                                render={({field: {onChange, ...field}}) => (
                                    <Autocomplete
                                        {...field}
                                        multiple
                                        options={postTypeOptions}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Post Type" placeholder="Post Type"/>
                                        )}
                                        onChange={(e, data) => onChange(data)}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid xs={12} sm={3}>
                            <Controller
                                name="bedRoomList"
                                control={control}
                                render={({field: {onChange, ...field}}) => (
                                    <Autocomplete
                                        {...field}
                                        multiple
                                        options={bedRoomOptions}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Bedroom" placeholder="Bedroom"/>
                                        )}
                                        getOptionLabel={(option) => isNaN(Number(option)) ? option : `${option} Bedroom`}
                                        onChange={(e, data) => onChange(data)}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid xs={12} sm={3}>
                            <Controller
                                name="bathroomList"
                                control={control}
                                render={({field: {onChange, ...field}}) => (
                                    <Autocomplete
                                        {...field}
                                        multiple
                                        options={bathroomOptions}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Bathroom" placeholder="Bathroom"/>
                                        )}
                                        getOptionLabel={(option) => `${option} Bathroom`}
                                        onChange={(e, data) => onChange(data)}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid container xs={12} sm={6}>
                            <Grid xs={12}>
                                <Typography fontWeight={500}>
                                    Price
                                </Typography>
                            </Grid>
                            <Grid xs={6}>
                                <TextField {...register("minPrice", {valueAsNumber: true})}
                                           type={"number"}
                                           label="Min price"
                                           variant="outlined"
                                           fullWidth/>
                            </Grid>
                            <Grid xs={6}>
                                <TextField {...register("maxPrice", {valueAsNumber: true})}
                                           type={"number"}
                                           label="Max price"
                                           variant="outlined"
                                           fullWidth/>
                            </Grid>
                        </Grid>

                        <Grid container xs={12} sm={6}>
                            <Grid xs={12}>
                                <Typography fontWeight={500}>
                                    Floor size (Sqm)
                                </Typography>
                            </Grid>
                            <Grid xs={6}>
                                <TextField {...register("minAreaSize", {valueAsNumber: true})}
                                           type={"number"}
                                           label="Min floor size"
                                           variant="outlined"
                                           fullWidth/>
                            </Grid>
                            <Grid xs={6}>
                                <TextField {...register("maxAreaSize", {valueAsNumber: true})}
                                           type={"number"}
                                           label="Max floor size"
                                           variant="outlined"
                                           fullWidth/>
                            </Grid>
                        </Grid>


                        <Grid xs={12}>
                            <Stack spacing={2} direction="row" justifyContent={"end"}>
                                <Button variant="outlined" onClick={resetHandler}>Reset</Button>
                                <Button type={"submit"} variant="contained">Search</Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </AccordionDetails>
        </Accordion>

    );
};

