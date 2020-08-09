class MultiStep {
  constructor() {
    this.data = {};
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
}

export default new MultiStep();
