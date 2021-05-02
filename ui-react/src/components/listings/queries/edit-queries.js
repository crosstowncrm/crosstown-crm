import { gql } from "@apollo/client";

export const fields = [
  {
    id: "id",
    editable: false,
    label: "id",
    grid: 1,
  },
  {
    id: "name",
    editable: true,
    label: "name",
    grid: 1,
  },
  {
    id: "units",
    editable: true,
    label: "units",
    grid: 1,
  },
  {
    id: "added",
    editable: false,
    label: "added",
    grid: 1,
  },
  {
    id: "availableOn",
    editable: true,
    label: "availableOn",
    grid: 1,
  },
  {
    id: "availableWithin",
    editable: true,
    label: "availableWithin",
    grid: 1,
  },
  {
    id: "cap_rate",
    editable: true,
    label: "cap_rate",
    grid: 1,
  },
  {
    id: "commission",
    editable: true,
    label: "commission",
    grid: 1,
  },
  {
    id: "conferenceRooms",
    editable: true,
    label: "conferenceRooms",
    grid: 1,
  },
  {
    id: "existingBuildout",
    editable: true,
    label: "existingBuildout",
    grid: 1,
  },
  // {
  //   id: "last_updated",
  //   editable: false,
  //   label: "last_updated",
  //   grid: 1
  // },
  {
    id: "lease_or_sale",
    editable: true,
    label: "lease_or_sale",
    grid: 1,
  },
  {
    id: "leaseTerm",
    editable: true,
    label: "leaseTerm",
    grid: 1,
  },
  {
    id: "leaseType",
    editable: true,
    label: "leaseType",
    grid: 1,
  },
  {
    id: "noi",
    editable: true,
    label: "noi",
    grid: 1,
  },
  {
    id: "numPeopleMax",
    editable: true,
    label: "numPeopleMax",
    grid: 1,
  },
  {
    id: "numPeopleMin",
    editable: true,
    label: "numPeopleMin",
    grid: 1,
  },
  {
    id: "parking_spaces",
    editable: true,
    label: "parking_spaces",
    grid: 1,
  },
  {
    id: "price",
    editable: true,
    label: "price",
    grid: 1,
  },
  {
    id: "priceTerms",
    editable: true,
    label: "priceTerms",
    grid: 1,
  },
  {
    id: "privateOffices",
    editable: true,
    label: "privateOffices",
    grid: 1,
  },
  {
    id: "pro_forma_noi",
    editable: true,
    label: "pro_forma_noi",
    grid: 1,
  },
  {
    id: "sfAvailMax",
    editable: true,
    label: "sfAvailMax",
    grid: 1,
  },
  {
    id: "sfAvailMin",
    editable: true,
    label: "sfAvailMin",
    grid: 1,
  },
  {
    id: "tenantName",
    editable: true,
    label: "tenantName",
    grid: 1,
  },
  {
    id: "workStations",
    editable: true,
    label: "workStations",
    grid: 1,
  },
  {
    id: "listing_expiration",
    editable: true,
    label: "listing_expiration",
    grid: 1,
  },
  {
    id: "investment_highlights",
    editable: true,
    label: "investment_highlights",
    grid: 2,
  },
  {
    id: "workStations",
    editable: true,
    label: "workStations",
    grid: 2,
  },
  {
    id: "spaceNotes",
    editable: true,
    label: "spaceNotes",
    grid: 2,
  },
  {
    id: "condition",
    editable: true,
    label: "condition",
    grid: 2,
  },
  // {
  //     id: "documents",
  //     editable: true,
  //     label: "documents",
  //     grid: 3
  // },
  {
    id: "users",
    editable: false,
    label: "users{id first_name last_name}",
    grid: 3,
  },
  {
    id: "properties",
    editable: false,
    label: "properties{id name}",
    grid: 3,
  },
];

let fieldsStr = fields
  .map((field) => {
    return field.label;
  })
  .join("\n");

// sale_conditions: [String]
// spaceHighlights: [String]
// use: [String]
// amenities: [String]
// images: [String]

// documents: [String]

const get_listing = `
query listingQuery($id: String) {
    getListingById(id: $id) {
        ${fieldsStr}
    }
}
`;
export const GET_LISTING = gql(get_listing);

export const UPDATE_LISTING = gql`
  mutation updateListing($field: String, $value: String, $listingId: String) {
    updateListing(field: $field, value: $value, listingId: $listingId) {
      id
    }
  }
`;
export const UPDATE_DATA = gql`
  mutation updateData(
    $nodeLabel: String
    $nodeId: String
    $listingId: String
    $label: String
  ) {
    updateData(
      label: $label
      nodeLabel: $nodeLabel
      nodeId: $nodeId
      unitId: $listingId
    )
  }
`;
export const PROPERTY_ADD = gql`
  mutation listingToPropertyAdd($from: String!, $to: String!) {
    listingToPropertyAdd(from: $from, to: $to)
  }
`;

export const USER_ADD = gql`
  mutation listingToUserAdd($from: String!, $to: String!) {
    listingToUserAdd(from: $from, to: $to)
  }
`;
