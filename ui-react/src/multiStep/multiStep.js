class MultiStep {
  constructor() {
    this.data = {};
    this.errors = {};
  }

  clear() {
    this.data = {};
  }

  saveData(formData) {
    if (formData.value && formData.value.constructor.name !== "Object") {
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
        ["street_address1"]: clientStreetAddressError,
      };
    }

    if (clientFirstNameError || clientStreetAddressError) {
      return false;
    }
    this.errors = {};
    return true;
  };

  validateComp = () => {
    let companyNameError = "";
    let companyStreetAddressError = "";

    if (!this.data.name) {
      companyNameError = "Required";
      this.errors = { ...this.errors, ["name"]: companyNameError };
    }

    if (!this.data.address || !this.data.address.street_address1) {
      companyStreetAddressError = "Required";
      this.errors.address = {
        ...this.errors.address,
        ["street_address1"]: companyStreetAddressError,
      };
    }

    if (companyNameError || companyStreetAddressError) {
      return false;
    }
    this.errors = {};
    return true;
  };

  validateTask = () => {
    let taskNameError = "";
    let taskAssignedError = "";
    let taskAssociatedError = "";
    console.log(this.data);
    if (!this.data.title) {
      taskNameError = "Required";
      this.errors = { ...this.errors, ["title"]: taskNameError };
    }

    if (!this.data.associated) {
      taskAssociatedError = "Required";
      this.errors = { ...this.errors, ["associated"]: taskAssociatedError };
    }

    if (!this.data.assigned) {
      taskAssignedError = "Required";
      this.errors = { ...this.errors, ["assigned"]: taskAssignedError };
    }

    if (taskNameError || taskAssociatedError || taskAssignedError) {
      return false;
    }
    this.errors = {};
    return true;
  };

  validateRole = () => {
    let roleNameError = "";

    if (!this.data.name) {
      roleNameError = "Required";
      this.errors = { ...this.errors, ["name"]: roleNameError };
    }

    if (roleNameError) {
      return false;
    }
    this.errors = {};
    return true;
  };

  isValid = () => {
    return this.validate();
  };

  errorRemove = (field) => {
    delete this.errors[field];
  };
}

export default new MultiStep();
