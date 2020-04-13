export default /* GraphQL */ `
  mutation {
    u1: CreateUser(id: "u1", name: "Will", pswd: "123") {
      id
      name
      pswd
    }
    u2: CreateUser(id: "u2", name: "Bob", pswd: "password") {
      id
      name
      pswd
    }
    u3: CreateUser(id: "u3", name: "Jenny", pswd: "password") {
      id
      name
      pswd
    }
    u4: CreateUser(id: "u4", name: "Angie", pswd: "password") {
      id
      name
      pswd
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
    }team2: CreateTeam(
      id: "team2"
      name: "ChicagoBulls"
      slogan: "I am the Best"
    ){
      id
      name
    }c1:CreateContact(
      id: "c1"
      first_name: "Charles"
      last_name: "Small"
      contact_emails: ["csmall@ddincorp.com"]
      job_title: "President and CEO"
      phone_numbers: ["803-256-5299"]
    ){
      id
      first_name
     }
     c2:CreateContact(
      id: "c2"
      first_name: "Dave"
      last_name: "Brock"
      contact_emails: ["dbrock@ddincorp.com"]
    ){
      id
      first_name
     }
     c3:CreateContact(
      id: "c3"
      first_name: "Bowen"
      last_name: "Horger"
      contact_emails: ["bhorger@ddincorp.com"]
    ){
      id
      first_name
     }c4:CreateContact(
      id: "c4"
      first_name: "Will"
      last_name: "Batson"
      contact_emails: ["wbatson@ddincorp.com"]
      job_title: "Chief development Officer"
      phone_numbers: ["803-309-7334"]
    ){
      id
      first_name
     }c5:CreateContact(
      id: "c5"
      first_name: "Andrew"
      last_name: "Dominik"
      contact_emails: ["marketing1@qualityguestpost.co.uk"]
        ){
      id
      first_name
     }c6:CreateContact(
      id: "c6"
      first_name: "Patrick"
      last_name: "Reily"
      phone_numbers: ["206-234-5919"]
    ){
      id
      first_name
     }c7:CreateContact(
      id: "c7"
      first_name: "Eric"
      last_name: "Jones"
      phone_numbers: ["425-746-1000"]
    ){
      id
      first_name
     }c8:CreateContact(
      id: "c8"
      first_name: "Lanzce"
      last_name: "Douglass"
      phone_numbers: ["509-483-6532"]
    ){
      id
      first_name
     }c9:CreateContact(
      id: "c9"
      first_name: "John"
      last_name: "McShane"
      contact_emails: ["johnmcshanecoinc@qwestoffice.net"]
    ){
      id
      first_name
     }c10:CreateContact(
      id: "c10"
      first_name: "WWJF"
      contact_emails: ["wwjf.storagexxtra.com"]
      created_date: 1582128457
    ){
      id
      first_name
     }c11:CreateContact(
      id: "c11"
      first_name: "Martin L."
      last_name: "Flanagan"
      created_date: 1582128457
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
      name: "Invesco Ltd."
      created_date: 1582128457
      phone_numbers: ["00 1 713-626-1919"]
    ) {
      id
      name
    }
    
    cmp2: CreateCompany(
      id: "cmp2"
      name: "Discount Self Storage"
      created_date: 1582128457
      phone_numbers: ["(575) 323-0160"]
    ) {
      id
      name
    }
    
    cmp3: CreateCompany(
      id: "cmp3"
      name: "Optiline Enterprises"
      created_date: 1582128457
      phone_numbers: ["(603) 402-1446"]
    ) {
      id
      name
    }
    
    cmp4: CreateCompany(
      id: "cmp4"
      name: "R. H. Burpee Companies"
      created_date: 1582128457
      phone_numbers: ["508-747-6900"]
    ) {
      id
      name
    }
    
    cmp5: CreateCompany(
      id: "cmp5"
      name: "O\'Brien Commercial Properties, Inc."
      created_date: 1582128457
      phone_numbers: ["+1 978-369-5500"]
    ) {
      id
      name
    }
    
    cmp6: CreateCompany(
      id: "cmp6"
      name: "B. Rutter LLC"
      created_date: 1582128457
      phone_numbers: ["+1 561-243-2888"]
    ) {
      id
      name
    }
    
    cmp7: CreateCompany(
      id: "cmp7"
      name: "Andover Self Storage"
      created_date: 1582128457
      phone_numbers: ["978-470-4747"]
    ) {
      id
      name
    }
    cmp8: CreateCompany(
      id: "cmp8"
      name: "Foushee"
      created_date: 1582128457
      phone_numbers: ["(425) 746-1000"]
    ) {
      id
      name
    }
    cmp9: CreateCompany(
      id: "cmp9"
      name: "Secure-It Self Storage"
      created_date: 1582128457
      phone_numbers: ["+1 518-241-5717"]
    ) {
      id
      name
    }
    cmp10: CreateCompany(
      id: "cmp10"
      name: "Secure-It Self Storage"
      created_date: 1582128457
      phone_numbers: ["+1 509-926-3900"]
    ) {
      id
      name
    }
    cmp11: CreateCompany(
      id: "cmp11"
      name: "STORE MORE Self Storage"
      created_date: 1582128457
      phone_numbers: ["(602) 598-5597"]
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
