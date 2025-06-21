import React from "react";

interface AddressProps {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

const AddressCard: React.FC<AddressProps> = ({ name, address, city, state, zip, phone }) => (
  <div className="border-2 rounded-xl p-4">
    <p className="font-medium mb-1">{name}</p>
    <p className="text-sm text-gray-600 leading-relaxed">
      {address}, {city},<br />{state} {zip}
    </p>
    <p className="text-sm text-gray-600 mt-1">{phone}</p>
  </div>
);

export default AddressCard;
