export default /* GraphQL */ `
  mutation {
    u1: CreateUser(id: "u1", name: "Will") {
      id
      name
    }
    u2: CreateUser(id: "u2", name: "Bob") {
      id
      name
    }
    u3: CreateUser(id: "u3", name: "Jenny") {
      id
      name
    }
    u4: CreateUser(id: "u4", name: "Angie") {
      id
      name
    }
    
    a1: CreateAddress(
      id: "a1"
      street_number: "77"
      house: 7
      city: "NY"
      state: "NY"
      lat: 53
      lng: 46
    ){
      id
      street_number
      house
      city
      state
      lat
      lng
    }
    a2: CreateAddress(
      id: "a2"
      street_number: "777"
      house: 77
      city: "NY"
      state: "NY"
      lat: 58
      lng: 46
    ){
      id
      street_number
      house
      city
      state
      lat
      lng
    }a3: CreateAddress(
      id: "a3"
      street_number: "77"
      house: 77
      city: "NY"
      state: "NY"
      lat: 23
      lng: 46
    ){
      id
      street_number
      house
      city
      state
      lat
      lng
    }a4: CreateAddress(
      id: "a4"
      street_number: "777"
      house: 7
      city: "NY"
      state: "NY"
      lat: 53
      lng: 16
    ){
      id
      street_number
      house
      city
      state
      lat
      lng
    }a5: CreateAddress(
      id: "a5"
      street_number: "87"
      house: 17
      city: "NY"
      state: "NY"
      lat: 52
      lng: 45
    ){
      id
      street_number
      house
      city
      state
      lat
      lng
    }team1: CreateTeam(
      id: "team1"
      name: "UtahJazz"
      slogan: "Hear My Row"
    ){
      id
      name
      slogan
    }team2: CreateTeam(
      id: "team2"
      name: "ChicagoBulls"
      slogan: "I am the Best"
    ){
      id
      name
      slogan
    }c1:CreateContact(
      id: "c1"
      first_name: "John Walker"
    ){
      id
      first_name
     }
     c2:CreateContact(
      id: "c2"
      first_name: "John Gotty"
    ){
      id
      first_name
     }
     c3:CreateContact(
      id: "c3"
      first_name: "Jack Sparrow"
    ){
      id
      first_name
     }b1: CreateBusiness(
      id: "b1"
      name: "KettleHouse Brewing Co."
      address: "313 N 1st St W"
      city: "Missoula"
      state: "MT"
    ) {
      id
      name
    }b2: CreateBusiness(
      id: "b2"
      name: "Coca Cola"
      address: "313 N 1st St W"
      city: "NY"
      state: "NY"
    ) {
      id
      name
    }b3: CreateBusiness(
      id: "b3"
      name: "Mars"
      address: "318 N 1st St W"
      city: "Missoula"
      state: "MT"
    ) {
      id
      name
    }b4: CreateBusiness(
      id: "b4"
      name: "Snickers"
      address: "313 N 1st St W"
      city: "Missoula"
      state: "MT"
    ) {
      id
      name
    }b5: CreateBusiness(
      id: "b5"
      name: "Bounty"
      address: "315 N 1st St W"
      city: "Missoula"
      state: "MT"
    ) {
      id
      name
    }l1 : CreateListing(
      id: "l1"
      name: "cListing"
    ) {
      id
      name
    }l2 : CreateListing(
      id: "l2"
      name: "aListing"
    ) {
      id
      name
    }l3 : CreateListing(
      id: "l3"
      name: "bListing"
    ) {
      id
      name
    }l4 : CreateListing(
      id: "l4"
      name: "dListing"
    ) {
      id
      name
    }l5 : CreateListing(
      id: "l5"
      name: "eListing"
    ) {
      id
      name
    }l6 : CreateListing(
      id: "l6"
      name: "fListing"
    ) {
      id
      name
    }p1 : CreateProperty(
      id: "p1"
      name: "aProperty"
    ) {
      id
      name
    }p2 : CreateProperty(
      id: "p2"
      name: "bProperty"
    ) {
      id
      name
    }p3 : CreateProperty(
      id: "p3"
      name: "cProperty"
    ) {
      id
      name
    }p4 : CreateProperty(
      id: "p4"
      name: "dProperty"
    ) {
      id
      name
    }p5 : CreateProperty(
      id: "p5"
      name: "eProperty"
    ) {
      id
      name
    }
    
    cmp1: CreateCompany(
      id: "cmp1"
      name: "Nintendo"
    ) {
      id
      name
    }
    
    cmp2: CreateCompany(
      id: "cmp2"
      name: "Sega"
    ) {
      id
      name
    }
    
    cmp3: CreateCompany(
      id: "cmp3"
      name: "Dendy"
    ) {
      id
      name
    }
    
    cmp4: CreateCompany(
      id: "cmp4"
      name: "Youtube"
    ) {
      id
      name
    }
    
    cmp5: CreateCompany(
      id: "cmp5"
      name: "Upwork"
    ) {
      id
      name
    }
    
    aua1: AddUserAddress(from: {id: "u1"}, to: {id: "a1"}){
      from {
        id
      }
     }aua2: AddUserAddress(from: {id: "u2"}, to: {id: "a2"}){
      from {
        id
      }
     }aua3: AddUserAddress(from: {id: "u3"}, to: {id: "a3"}){
      from {
        id
      }
     }aua4: AddUserAddress(from: {id: "u4"}, to: {id: "a4"}){
      from {
        id
      }
     }
     auf1: AddUserFollows(from: {id: "u1"}, to: {id: "u2"}){
      from {
        id
      }
     }auf2: AddUserFollows(from: {id: "u2"}, to: {id: "u3"}){
      from {
        id
      }
     }auf3: AddUserFollows(from: {id: "u3"}, to: {id: "u4"}){
      from {
        id
      }
     }auf4: AddUserFollows(from: {id: "u4"}, to: {id: "u1"}){
      from {
        id
      }
     }aut1: AddUserTeams(from: {id: "u1"}, to: {id: "team1"}){
      from {
        id
      }
     }aut2: AddUserTeams(from: {id: "u2"}, to: {id: "team1"}){
      from {
        id
      }
     }aut3: AddUserTeams(from: {id: "u3"}, to: {id: "team2"}){
      from {
        id
      }
     }aut4: AddUserTeams(from: {id: "u4"}, to: {id: "team2"}){
      from {
        id
      }
     }auc1: AddUserContacts(from: {id: "u1"}, to: {id: "c1"}){
      from {
        id
      }
     }auc2: AddUserContacts(from: {id: "u1"}, to: {id: "c2"}){
      from {
        id
      }
     }auc3: AddUserContacts(from: {id: "u2"}, to: {id: "c1"}){
      from {
        id
      }
     }auc4: AddUserContacts(from: {id: "u2"}, to: {id: "c3"}){
      from {
        id
      }
     }auc5: AddUserContacts(from: {id: "u3"}, to: {id: "c1"}){
      from {
        id
      }
     }auc6: AddUserContacts(from: {id: "u3"}, to: {id: "c2"}){
      from {
        id
      }
     }auc7: AddUserContacts(from: {id: "u4"}, to: {id: "c1"}){
      from {
        id
      }
     }aucmpn1: AddUserCompanies(from: {id: "u1"}, to: {id: "b1"}){
      from {
        id
      }
     }aucmpn2: AddUserCompanies(from: {id: "u2"}, to: {id: "b2"}){
      from {
        id
      }
     }aucmpn3: AddUserCompanies(from: {id: "u3"}, to: {id: "b3"}){
      from {
        id
      }
     }aucmpn4: AddUserCompanies(from: {id: "u4"}, to: {id: "b3"}){
      from {
        id
      }
     }
     aca1: AddContactAddress(from: {id: "c1"}, to: {id: "a1"}){
      from {
        id
      }
     }
     aca2: AddContactAddress(from: {id: "c1"}, to: {id: "a2"}){
      from {
        id
      }
     }
     aca3: AddContactAddress(from: {id: "c2"}, to: {id: "a3"}){
      from {
        id
      }
     }
     aca4: AddContactAddress(from: {id: "c3"}, to: {id: "a4"}){
      from {
        id
      }
     }
     aca5: AddContactAddress(from: {id: "c3"}, to: {id: "a2"}){
      from {
        id
      }
     }
     acc1: AddContactCompanies(from: {id: "c3"}, to: {id: "cmp1"}){
      from {
        id
      }
     }
     acc2: AddContactCompanies(from: {id: "c3"}, to: {id: "cmp2"}){
      from {
        id
      }
     }
     acc3: AddContactCompanies(from: {id: "c1"}, to: {id: "cmp2"}){
      from {
        id
      }
     }
     acc4: AddContactCompanies(from: {id: "c1"}, to: {id: "cmp3"}){
      from {
        id
      }
     }
     acc5: AddContactCompanies(from: {id: "c2"}, to: {id: "cmp4"}){
      from {
        id
      }
     }
     
     acp1: AddContactProperties(from: {id: "c2"}, to: {id: "p4"}){
      from {
        id
      }
     }
     acp2: AddContactProperties(from: {id: "c2"}, to: {id: "p3"}){
      from {
        id
      }
     }
     acp3: AddContactProperties(from: {id: "c2"}, to: {id: "p2"}){
      from {
        id
      }
     }
     acp4: AddContactProperties(from: {id: "c1"}, to: {id: "p4"}){
      from {
        id
      }
     }
     acp5: AddContactProperties(from: {id: "c1"}, to: {id: "p1"}){
      from {
        id
      }
     }
     acp6: AddContactProperties(from: {id: "c3"}, to: {id: "p2"}){
      from {
        id
      }
     }
     acl1: AddContactListings(from: {id: "c3"}, to: {id: "l2"}){
      from {
        id
      }
     }
     acl2: AddContactListings(from: {id: "c3"}, to: {id: "l1"}){
      from {
        id
      }
     }
     acl3: AddContactListings(from: {id: "c3"}, to: {id: "l3"}){
      from {
        id
      }
     }
     acl4: AddContactListings(from: {id: "c1"}, to: {id: "l2"}){
      from {
        id
      }
     }
     acl5: AddContactListings(from: {id: "c2"}, to: {id: "l2"}){
      from {
        id
      }
     }
   }
`;
