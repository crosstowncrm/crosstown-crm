class MultiStep {
  constructor() {
    this.data = {};
    this.errors = {};
  }

  clear() {
    this.data = {};
  }

  saveData(formData) {
    if (formData.value.constructor.name !== "Object") {
      this.data = { ...this.data, [formData.name]: formData.value };
    } else {
      const name = Object.keys(formData.value)[0];
      const value = formData.value[name];
      this.data[formData.name] = { ...this.data[formData.name], [name]: value };
    }
  }

  getData() {
    return this.data;
  }

  getErrors = () => {
    return this.errors;
  };

  validate = () => {
    let clientFirstNameError = "";
    let clientStreetAddressError = "";

    if (!this.data.first_name) {
      clientFirstNameError = "Required";
      this.errors = { ...this.errors, ["first_name"]: clientFirstNameError };
    }

    if (!this.data.address || !this.data.address.street_address1) {
      clientStreetAddressError = "Required";
      this.errors.address = {
        ...this.errors.address,
        ["street_address1"]: clientStreetAddressError
      };
    }

    if (clientFirstNameError || clientStreetAddressError) {
      return false;
    }
    this.errors = {};
    return true;
  };

  isValid = () => {
    return this.validate();
  };

  errorRemove = field => {
    console.log("delete error");
    console.log(this.errors);
    delete this.errors[field];
    console.log(this.errors);
  };
}

export default new MultiStep();
