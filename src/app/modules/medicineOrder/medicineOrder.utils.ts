import httpStatus from 'http-status';
import AppError from "../../errors/AppError";

export const BANGLADESH_DISTRICTS = [
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Barishal",
  "Bhola",
  "Bogura",
  "Brahmanbaria",
  "Chandpur",
  "Chapainawabganj",
  "Chattogram",
  "Chuadanga",
  "Cox's Bazar",
  "Cumilla",
  "Dhaka",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jashore",
  "Jhalokati",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachhari",
  "Khulna",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Mymensingh",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rajshahi",
  "Rangamati",
  "Rangpur",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Sylhet",
  "Tangail",
  "Thakurgaon",
] as const;

export type BangladeshDistrict =
  (typeof BANGLADESH_DISTRICTS)[number];

const INSIDE_CITY_DISTRICTS: BangladeshDistrict[] = [
  "Dhaka",
  "Feni",
];

export const getMedicineDeliveryFee = (
  district: string,
): number => {
  const normalizedDistrict = district.trim();

  const isValidDistrict = BANGLADESH_DISTRICTS.some(
    (item) => item === normalizedDistrict,
  );

  if (!isValidDistrict) {
    throw new Error("Please select a valid Bangladesh district.");
  }
  if(!isValidDistrict){
    throw new AppError(httpStatus.BAD_REQUEST,
      "Please select a valid Bangladesh district."
    );
  }

  return INSIDE_CITY_DISTRICTS.includes(
    normalizedDistrict as BangladeshDistrict,
  )
    ? 80
    : 120;
};
