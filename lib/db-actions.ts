
import { supabase } from "./supabase";

export const savePatientRecord = async (id: string | null, formData: any, followups: any[]) => {
  const patientPayload = {
    name: formData.name,
    phone: formData.phone,
    pt: formData.pt,
    gender: formData.gender,
    dob: formData.dob || null,
    blood_type: formData.bloodType,
    nationality: formData.nationality,
    phone2: formData.phone2,
    email: formData.email,
    language: formData.language,
    address: formData.address,
    ec_name: formData.ecName,
    ec_phone: formData.ecPhone,
    passport: formData.passport,
    country: formData.country,
    visa: formData.visa,
    arrival_date: formData.arrivalDate || null,
    departure_date: formData.departureDate || null,
    hotel: formData.hotel,
    referrer: formData.referrer,
    interpreter: formData.interpreter,
    treat: formData.treat,
    treat_plan: formData.treatPlan,
    ref_src: formData.refSrc,
    conditions: formData.conditions,
    surgeries: formData.surgeries,
    medications: formData.medications,
    allergies: formData.allergies,
    family_hx: formData.familyHx,
    obs_hx: formData.obsHx,
    lab_rem: formData.labRem,
    lab_date: formData.labDate || null,
    lab_pend: formData.labPend,
    fu1: followups[0] || {},
    fu2: followups[1] || {},
    fu3: followups[2] || {},
    fu4: followups[3] || {},
    pay_status: formData.payStatus,
    currency: formData.currency,
    total_amt: parseFloat(formData.totalAmt) || 0,
    paid_amt: parseFloat(formData.paidAmt) || 0,
    pay_method: formData.payMethod,
    insurance: formData.insurance,
    pay_rem: formData.payRem,
    updated_date: new Date().toISOString()
  };

  if (id) {
    return await supabase.from('patients').update(patientPayload).eq('id', id);
  } else {
    const newId = `CHC-${Date.now().toString().slice(-5)}`;
    return await supabase.from('patients').insert([{ id: newId, ...patientPayload }]);
  }
};