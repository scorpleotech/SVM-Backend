const TcoCalculator = require("../models/tco.model");
const FinancialInput = require("../models/financial-inputs.model");

// Create a new vehicle
exports.createTco = async (req, res) => {
  try {
    let {
      vehicle,
      manufacturer,
      model,
      vehicleClass,
      topSpeed,
      acceleration,
      releaseDate,
      acquisition,
      operatingCosts,
      battery_capacity,
    } = req.body;

    let financing = {};

    const financialInput = await FinancialInput.findOne({});

    const { finanace_cost, operating_costs_INR, taxes, other_inputs } =
      financialInput;

    if (
      operatingCosts.chargingTime == "" ||
      operatingCosts.chargingTime == 0.0
    ) {
      acquisition.GST = ((acquisition.cost * taxes.GST_ICE) / 100).toFixed(2);
    } else {
      acquisition.GST = ((acquisition.cost * taxes.GST_EV) / 100).toFixed(2);
    }

    console.log("accusation gst ", acquisition.GST);
    console.log("acquisition cost ", acquisition.cost);

    acquisition.totalCost = (
      parseFloat(acquisition.cost) + parseFloat(acquisition.GST)
    ).toFixed(2);
    console.log("total cost ", acquisition.totalCost);
    financing.totalCostInclGst = parseFloat(acquisition.totalCost);

    financing.downPayment = -(
      (financing.totalCostInclGst * finanace_cost.down_payment) /
      100
    ).toFixed(2);

    financing.residual = parseFloat(
      (financing.totalCostInclGst * finanace_cost.residual_value).toFixed(2)
    );

    financing.amountToFinance = parseFloat(
      (
        parseFloat(financing.totalCostInclGst) +
        parseFloat(financing.downPayment) +
        parseFloat(financing.residual)
      ).toFixed(2)
    );

    financing.annualPMT = PMT(
      finanace_cost.cost_per_annual / 100,
      finanace_cost.lease_terms,
      financing.amountToFinance,
      financing.residual,
      0
    ).toFixed(2);

    if (
      operatingCosts.chargingTime == "" ||
      operatingCosts.chargingTime == 0.0
    ) {
      operatingCosts.kWhOrLitres = parseFloat(
        other_inputs.annual_KM_driven / operatingCosts.range
      ).toFixed(2);
    } else {
      operatingCosts.kWhOrLitres = parseFloat(
        (other_inputs.annual_KM_driven / operatingCosts.range) *
          operatingCosts.chargingTime
      ).toFixed(2);
    }
    if (
      operatingCosts.chargingTime == "" ||
      operatingCosts.chargingTime == 0.0
    ) {
      operatingCosts.fuel = parseFloat(
        (operatingCosts.kWhOrLitres * operating_costs_INR.petrol_per_liter) /
          other_inputs.FX_rate_INR_to_USD
      ).toFixed(2);
    } else {
      operatingCosts.fuel = parseFloat(
        (operatingCosts.kWhOrLitres * operating_costs_INR.kWh) /
          other_inputs.FX_rate_INR_to_USD
      ).toFixed(2);
    }
    if (
      operatingCosts.chargingTime == "" ||
      operatingCosts.chargingTime == 0.0
    ) {
      operatingCosts.maintenance = parseFloat(
        operating_costs_INR.maintenance_ICE_per_annum /
          other_inputs.FX_rate_INR_to_USD
      ).toFixed(2);
    } else {
      operatingCosts.maintenance = parseFloat(
        operating_costs_INR.maintenance_EV_per_annum /
          other_inputs.FX_rate_INR_to_USD
      ).toFixed(2);
    }

    operatingCosts.totalTCOpA = parseFloat(
      parseFloat(-financing.annualPMT) +
        parseFloat(operatingCosts.fuel) +
        parseFloat(operatingCosts.maintenance)
    ).toFixed(2);

    operatingCosts.totalTCO = parseFloat(
      parseFloat(operatingCosts.totalTCOpA) *
        parseFloat(finanace_cost.lease_terms)
    ).toFixed(2);

    financing.annualPMT = -financing.annualPMT;
    financing.downPayment = -financing.downPayment;

    const data = {
      vehicle,
      manufacturer,
      model,
      vehicleClass,
      topSpeed,
      acceleration,
      releaseDate,
      battery_capacity,
      "acquisition.cost": acquisition.cost,
      "acquisition.GST": Math.round(acquisition.GST),
      "acquisition.totalCost": Math.round(acquisition.totalCost),
      "financing.totalCostInclGst": Math.round(financing.totalCostInclGst),
      "financing.downPayment": Math.round(financing.downPayment),
      "financing.residual": Math.round(financing.residual),
      "financing.amountToFinance": Math.round(financing.amountToFinance),
      "financing.annualPMT": Math.round(financing.annualPMT),
      "operatingCosts.chargingTime": Math.round(operatingCosts.chargingTime),
      "operatingCosts.range": operatingCosts.range,
      "operatingCosts.kWhOrLitres": Math.round(operatingCosts.kWhOrLitres),
      "operatingCosts.fuel": Math.round(operatingCosts.fuel),
      "operatingCosts.maintenance": Math.round(operatingCosts.maintenance),
      "operatingCosts.totalTCOpA": Math.round(operatingCosts.totalTCOpA),
      "operatingCosts.totalTCO": Math.round(operatingCosts.totalTCO),
    };

    console.log("Final Data", data);

    const tco = new TcoCalculator(data);
    await tco.save();
    res.status(201).json(tco);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

function PMT(ir, np, pv, fv, type) {
  /*
   * ir   - interest rate per month
   * np   - number of periods (months)
   * pv   - present value
   * fv   - future value
   * type - when the payments are due:
   *        0: end of the period, e.g. end of month (default)
   *        1: beginning of period
   */
  let pmt, pvif;

  fv || (fv = 0);
  type || (type = 0);

  if (ir === 0) return -(pv + fv) / np;

  pvif = Math.pow(1 + ir, np);
  pmt = (-ir * (pv * pvif + fv)) / (pvif - 1);

  if (type === 1) pmt /= 1 + ir;

  return pmt;
}

// Get all vehicles
exports.getAllTcos = async (req, res) => {
  try {
    const tco = await TcoCalculator.find();

    const svm = tco.filter((item) => item.vehicle === "SVM");
    const other = tco.filter((item) => item.vehicle !== "SVM");

    res.json({ tco, svm, other });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific vehicle
exports.getTcoById = async (req, res) => {
  try {
    const tco = await TcoCalculator.findById(req.params.id);
    if (!tco) {
      return res.status(404).json({ message: "Vechicle not found" });
    }
    res.json(tco);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get two specific vehicles for comparison
exports.getComparison = async (req, res) => {
  const { vehicle1, vehicle2 } = req.query;

  try {
    // Find the two vehicles by their IDs
    const vehicle1Data = await TcoCalculator.findById(vehicle1);
    const vehicle2Data = await TcoCalculator.findById(vehicle2);

    // Check if both vehicles exist
    if (!vehicle1Data || !vehicle2Data) {
      return res
        .status(404)
        .json({ message: "One or both vehicles not found" });
    }

    // Return the two vehicles for comparison
    res.json({ vehicle1: vehicle1Data, vehicle2: vehicle2Data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a vehicle
exports.updateTco = async (req, res) => {
  try {
    let {
      vehicle,
      manufacturer,
      model,
      vehicleClass,
      topSpeed,
      acceleration,
      releaseDate,
      acquisition,
      operatingCosts,
      battery_capacity,
    } = req.body;

    let financing = {};

    const financialInput = await FinancialInput.findOne({});

    const { finanace_cost, operating_costs_INR, taxes, other_inputs } =
      financialInput;

    if (
      operatingCosts.chargingTime == "" ||
      operatingCosts.chargingTime == 0.0
    ) {
      acquisition.GST = ((acquisition.cost * taxes.GST_ICE) / 100).toFixed(2);
    } else {
      acquisition.GST = ((acquisition.cost * taxes.GST_EV) / 100).toFixed(2);
    }

    console.log("accusation gst ", acquisition.GST);
    console.log("acquisition cost ", acquisition.cost);

    acquisition.totalCost = (
      parseFloat(acquisition.cost) + parseFloat(acquisition.GST)
    ).toFixed(2);
    console.log("total cost ", acquisition.totalCost);
    financing.totalCostInclGst = parseFloat(acquisition.totalCost);

    financing.downPayment = -(
      (financing.totalCostInclGst * finanace_cost.down_payment) /
      100
    ).toFixed(2);

    financing.residual = parseFloat(
      (financing.totalCostInclGst * finanace_cost.residual_value).toFixed(2)
    );

    financing.amountToFinance = parseFloat(
      (
        parseFloat(financing.totalCostInclGst) +
        parseFloat(financing.downPayment) +
        parseFloat(financing.residual)
      ).toFixed(2)
    );

    financing.annualPMT = PMT(
      finanace_cost.cost_per_annual / 100,
      finanace_cost.lease_terms,
      financing.amountToFinance,
      financing.residual,
      0
    ).toFixed(2);

    if (
      operatingCosts.chargingTime == "" ||
      operatingCosts.chargingTime == 0.0
    ) {
      operatingCosts.kWhOrLitres = parseFloat(
        other_inputs.annual_KM_driven / operatingCosts.range
      ).toFixed(2);
    } else {
      operatingCosts.kWhOrLitres = parseFloat(
        (other_inputs.annual_KM_driven / operatingCosts.range) *
          operatingCosts.chargingTime
      ).toFixed(2);
    }
    if (
      operatingCosts.chargingTime == "" ||
      operatingCosts.chargingTime == 0.0
    ) {
      operatingCosts.fuel = parseFloat(
        (operatingCosts.kWhOrLitres * operating_costs_INR.petrol_per_liter) /
          other_inputs.FX_rate_INR_to_USD
      ).toFixed(2);
    } else {
      operatingCosts.fuel = parseFloat(
        (operatingCosts.kWhOrLitres * operating_costs_INR.kWh) /
          other_inputs.FX_rate_INR_to_USD
      ).toFixed(2);
    }
    if (
      operatingCosts.chargingTime == "" ||
      operatingCosts.chargingTime == 0.0
    ) {
      operatingCosts.maintenance = parseFloat(
        operating_costs_INR.maintenance_ICE_per_annum /
          other_inputs.FX_rate_INR_to_USD
      ).toFixed(2);
    } else {
      operatingCosts.maintenance = parseFloat(
        operating_costs_INR.maintenance_EV_per_annum /
          other_inputs.FX_rate_INR_to_USD
      ).toFixed(2);
    }

    operatingCosts.totalTCOpA = parseFloat(
      parseFloat(-financing.annualPMT) +
        parseFloat(operatingCosts.fuel) +
        parseFloat(operatingCosts.maintenance)
    ).toFixed(2);

    operatingCosts.totalTCO = parseFloat(
      parseFloat(operatingCosts.totalTCOpA) *
        parseFloat(finanace_cost.lease_terms)
    ).toFixed(2);

    financing.annualPMT = -financing.annualPMT;
    financing.downPayment = -financing.downPayment;

    const data = {
      vehicle,
      manufacturer,
      model,
      vehicleClass,
      topSpeed,
      acceleration,
      releaseDate,
      battery_capacity,
      "acquisition.cost": acquisition.cost,
      "acquisition.GST": Math.round(acquisition.GST),
      "acquisition.totalCost": Math.round(acquisition.totalCost),
      "financing.totalCostInclGst": Math.round(financing.totalCostInclGst),
      "financing.downPayment": Math.round(financing.downPayment),
      "financing.residual": Math.round(financing.residual),
      "financing.amountToFinance": Math.round(financing.amountToFinance),
      "financing.annualPMT": Math.round(financing.annualPMT),
      "operatingCosts.chargingTime": Math.round(operatingCosts.chargingTime),
      "operatingCosts.range": operatingCosts.range,
      "operatingCosts.kWhOrLitres": Math.round(operatingCosts.kWhOrLitres),
      "operatingCosts.fuel": Math.round(operatingCosts.fuel),
      "operatingCosts.maintenance": Math.round(operatingCosts.maintenance),
      "operatingCosts.totalTCOpA": Math.round(operatingCosts.totalTCOpA),
      "operatingCosts.totalTCO": Math.round(operatingCosts.totalTCO),
    };

    const updatedTco = await TcoCalculator.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );
    res.json(updatedTco);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a vehicle
exports.deleteTco = async (req, res) => {
  try {
    const tco = await TcoCalculator.findByIdAndDelete(req.params.id);
    if (!tco) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
