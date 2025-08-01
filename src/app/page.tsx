"use client";
import {ListingTable} from "@/components/Home/ListingTable/ListingTable";
import {Container} from "@mui/material";
import useGetAllListings from "@/hooks/useGetAllListings";
import {SearchForm} from "@/components/Home/Search/SearchForm";
import {SearchFormType} from "@/types/searchForm";
import {useEffect, useState} from "react";
import {Property} from "@/types/listing";
import {UpdateAvailabilityType} from "@/constants/property";
import dayjs from "dayjs";

export default function Home() {
    const {data, isLoading} = useGetAllListings();
    const [condition, setCondition] = useState<SearchFormType>();
    const [tableRows, setTableRows] = useState<Property[]>([]);

    useEffect(() => {
        const customSort = (a: Property, b: Property) => {
            // Extract the alphabetic prefix and numeric part of the SKU
            const [prefixA, numA] = a.sku.split("-");
            const [prefixB, numB] = b.sku.split("-");

            // Compare the prefixes first
            if (prefixA < prefixB) return -1;
            if (prefixA > prefixB) return 1;

            // If prefixes are the same, compare the numeric part as numbers
            return parseInt(numA, 10) - parseInt(numB, 10);
        };

        if (condition) {
            const filteredRows = data?.filter((row) => {
                let isMatch = true;
                if (condition.projectNameList.length > 0) {
                    isMatch = isMatch && condition.projectNameList.includes(row.titleEN);
                }
                if (condition.skuList.length > 0) {
                    isMatch = isMatch && condition.skuList.includes(row.sku);
                }
                if (condition.areaLPList.length > 0) {
                    isMatch = isMatch && condition.areaLPList.includes(row.areaLP);
                }
                if (condition.postTypeList.length > 0) {
                    isMatch = isMatch && condition.postTypeList.includes(row.postType);
                }
                if (condition.propertyTypeList.length > 0) {
                    isMatch = isMatch && condition.propertyTypeList.includes(row.propertyType);
                }
                if (condition.availabilityList.length > 0) {
                    isMatch = isMatch && condition.availabilityList.includes(row.availability);
                }
                if (condition.bedRoomList.length > 0) {
                    if (condition.bedRoomList.includes("3")) {
                        isMatch = isMatch && !isNaN(Number(row.bedroom)) && (+row.bedroom) >= 3;
                    } else {
                        isMatch = isMatch && condition.bedRoomList.includes(row.bedroom);
                    }
                }
                if (condition.bathroomList.length > 0) {
                    if (condition.bathroomList.includes("3")) {
                        isMatch = isMatch && !isNaN(Number(row.bathroom)) && (+row.bathroom) >= 3;
                    } else {
                        isMatch = isMatch && condition.bathroomList.includes(row.bathroom);
                    }
                }
                if (condition.postFromTypeList.length > 0) {
                    isMatch = isMatch && condition.postFromTypeList.includes(row.postFrom);
                }
                if (condition.areaLVList.length > 0) {
                    const splitAreaLV = row.areaLV.split(", ");
                    isMatch = isMatch && condition.areaLVList.some(areaLV => splitAreaLV.includes(areaLV));
                }
                if (condition.minPrice) {
                    isMatch = isMatch && condition.minPrice <= row.price;
                }
                if (condition.maxPrice) {
                    isMatch = isMatch && condition.maxPrice >= row.price;
                }
                if (condition.minAreaSize) {
                    isMatch = isMatch && condition.minAreaSize <= row.areaSize;
                }
                if (condition.maxAreaSize) {
                    isMatch = isMatch && condition.maxAreaSize >= row.areaSize;
                }
                if (condition.petAllowed) {
                    isMatch = isMatch && row.petAllowed === "Allow";
                }
                if (condition.exclusive) {
                    isMatch = isMatch && row.exclusive === "Exclusive";
                }
                if (condition.updateAvailability) {
                    if (!row.updateAvailability) return false;
                    const now = dayjs();
                    const updateAvailability = dayjs(row.updateAvailability);
                    const diff = now.diff(updateAvailability, "day");
                    if (condition.updateAvailability === UpdateAvailabilityType.Less_than_7_days) {
                        isMatch = isMatch && diff < 7;
                    } else if (condition.updateAvailability === UpdateAvailabilityType.Less_than_30_days) {
                        isMatch = isMatch && diff < 30;
                    } else {
                        return false;
                    }
                }
                if (condition.tel) {
                    isMatch = isMatch && row.tel?.replace(/\D/g, "").includes(condition.tel.replace(/\D/g, ""));
                }
                return isMatch;
            });
            // setTableRows(filteredRows || []);
            const sortedRows = filteredRows?.sort(customSort);
            setTableRows(sortedRows || []);
        } else {
            // setTableRows(data || []);
            const sortedData = data?.sort(customSort);
            setTableRows(sortedData || []);
        }
    }, [condition, data]);

    const searchHandler = (condition: SearchFormType) => {
        setCondition(condition);
    };

    return (
        <Container disableGutters={true}>
            <div className={"flex flex-col gap-2 mt-4"}>
                <SearchForm properties={data || []} onSearch={searchHandler} isLoading={isLoading}/>
                <ListingTable rows={tableRows} isLoading={isLoading}/>
            </div>
        </Container>
    );
}
