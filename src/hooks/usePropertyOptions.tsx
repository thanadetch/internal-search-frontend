import {Property} from "@/types/listing";
import {getUniqueValues} from "@/utils/valueUtils";
import {PostFromType, PostType, PropertyType, UpdateAvailabilityType} from "@/constants/property";
import {AvailabilityType} from "@/types/availability";

export const usePropertyOptions = (properties: Property[]) => {
    const skuOptions: string[] = getUniqueValues(properties?.map((property) => property.sku) || []);
    const areaLPOptions: string[] = getUniqueValues(properties?.map((property) => property.areaLP).filter(Boolean) || []);
    const areaLVOptions = getUniqueValues(properties.map(property => property.areaLV?.split(",").map(value => value.trim())).flat().filter(Boolean) || []);
    const projectNameOptions: string[] = getUniqueValues(properties?.map((property) => property.titleEN) || []);
    const propertyTypeOptions: PropertyType[] = Object.values(PropertyType);
    const postTypeOptions: PostType[] = Object.values(PostType);
    const postFromTypeOptions: PostFromType[] = Object.values(PostFromType);
    const bedroomOptions = ["Studio", ...new Array(3).fill(0).map((_, index) => (index + 1).toString())];
    const bathroomOptions = new Array(3).fill(0).map((_, index) => (index + 1).toString());
    const availabilityOptions = Object.values(AvailabilityType);
    const updateAvailabilityOptions = Object.values(UpdateAvailabilityType);
    const facingDirectionOptions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];

    return {
        skuOptions,
        areaLPOptions,
        areaLVOptions,
        projectNameOptions,
        propertyTypeOptions,
        postTypeOptions,
        postFromTypeOptions,
        bedroomOptions,
        bathroomOptions,
        availabilityOptions,
        updateAvailabilityOptions,
        facingDirectionOptions
    }
};
