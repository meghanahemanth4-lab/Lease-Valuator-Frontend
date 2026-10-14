import { get, post, put, del } from "./api-client";

// Contract Types
export const fetchContractTypes = async () => {
  return get("/contract-types/contract-type-ids");
};

export const fetchContractType = async (contractTypeId) => {
  return get(`/contract-types/${contractTypeId}`);
};

export const fetchTotalLeaseContract = async (contractTypeId) => {
  return get(`/contract-types/${contractTypeId}`);
};

export const saveLeaseContractType = async (data) => {
  return post("/contract-types/createContractType", data);
};

export const getAllLeaseContractType = async () => {
  return get("/contract-types/allContractTypes");
};

export const getAllLeaseNullContractType = async () => {
  return get("/contract-types/nullBaseRent");
};

export const updateContractTypeFields = async (contractTypeId, data) => {
  return post(`/contract-types/updateContractTypeFields/${contractTypeId}`, data);
};

export const deleteContractType = async (contractTypeId) => {
  return del(`/contract-types/${contractTypeId}`);
};

export const updateLeaseContractStatus = async (contractId, status) => {
  return put(`/contract/${contractId}/status`, { status });
};

// Lease Contracts
export const saveLeaseContract = async (data) => {
  return post("/contract/createLeaseContract", data);
};

export const getLeaseContract = async (contractId) => {
  return get(`/contract/${contractId}`);
};

export const getAllLeases = async () => {
  return get("/contract/all-leases");
};

export const deleteLeaseContract = async (contractId) => {
  return del(`/contract/${contractId}`);
};

// Lease Schedules
export const getTotalLeaseContract = async (contractId) => {
  return get(`/schedule/contractId/${contractId}`);
};

export const getLeaseValueCalculation = async (contractNo) => {
  return get(`/schedule/contractId/${contractNo}`);
};

export const getLeaseContractStatusUpdation = async (state) => {
  // Backend expects POST to /schedule/update-status/ with AmortizationEntryUpdateDTO
  return post(`/schedule/update-status/`, state);
};

export const getLeaseContractAllStatusUpdation = async (state) => {
  return post(`/schedule/update-status/bulk/`, state);
};

// Defaulted Leases
export const getDefaultedLeaseContract = async () => {
  return get(`/contract/defaulted/all-leases`);
};

export const updateDefaultedLease = async (id, data) => {
  return put(`/contract/defaulted/${id}`, data);
};

export const deleteDefaultedLease = async (id) => {
  return del(`/contract/defaulted/${id}`);
};

// Terminated Leases
export const getTerminatedLeaseContract = async () => {
  return get(`/contract/terminated/all-leases`);
};

export const updateTerminatedLease = async (id, data) => {
  return put(`/contract/terminated/${id}`, data);
};

export const deleteTerminatedLease = async (id) => {
  return del(`/contract/terminated/${id}`);
};

export const getTerminatedLeaseValueIfReversed = async (id) => {
  return get(`/contract/terminated/all/${id}`);
};

// User Authentication - Backend endpoints
export const saveSignInDetails = async (data) => {
  return post("/auth/signup", data);
};

export const getLogin = async (data) => {
  return post("/auth/signin", data);
};

// Active Leases
export const getAllActiveLeases = async () => {
  return get(`/active-leases/all`);
};

export const getActiveLease = async (id) => {
  return get(`/active-leases/${id}`);
};

export const updateActiveLease = async (id, data) => {
  return put(`/active-leases/${id}`, data);
};

export const deleteActiveLease = async (id) => {
  return del(`/active-leases/${id}`);
};

// Customer Management
export const getAllContractDraft = async () => {
  return get(`/customer`);
};

export const updateCustomer = async (id, data) => {
  return put(`/customer/${id}`, data);
};

export const deleteCustomer = async (id) => {
  return del(`/customer/${id}`);
};

export const createCustomer = async (data) => {
  return post(`/customer`, data);
};

// Interest Rates
export const getAllInterRate = async () => {
  return get(`/interest-rate`);
};

export const postInterRate = async (data) => {
  // Backend expects just the numeric value as a string, not JSON
  const rateValue = data.interestRate ? data.interestRate.toString() : data.toString();
  
  // Send as text/plain since backend expects @RequestBody String rate
  // Spring Boot can parse plain text strings directly
  return post(`/interest-rate`, rateValue, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
};

// Accounting
export const getAccountingEntries = async (data) => {
  return post(`/accounting-entry`, data);
};

export const getAllHolidayList = async (data) => {
  // TODO: Implement when backend endpoint is available
  return [];
};
