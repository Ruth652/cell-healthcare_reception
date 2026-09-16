"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PatientForm from "@/components/patients/PatientForm";

export default function EditPatientPage() {
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    async function fetchPatient() {
      if (!id) return;
      
      const { data: p, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !p) {
        setLoading(false);
        return;
      }

      setInitialData({
        name: p.name || "",
        phone: p.phone || "",
        pt: p.pt || "local",
        gender: p.gender || "Female",
        dob: p.dob || "",
        bloodType: p.blood_type || "Unknown",
        nationality: p.nationality || "",
        phone2: p.phone2 || "",
        email: p.email || "",
        language: p.language || "",
        address: p.address || "",
        ecName: p.ec_name || "",
        ecPhone: p.ec_phone || "",
        passport: p.passport || "",
        country: p.country || "",
        visa: p.visa || "",
        arrivalDate: p.arrival_date || "",
        departureDate: p.departure_date || "",
        hotel: p.hotel || "",
        referrer: p.referrer || "",
        interpreter: p.interpreter || "No",
        treat: p.treat || "",
        treatPlan: p.treat_plan || "",
        refSrc: p.ref_src || "Self-referred",
        conditions: p.conditions || "",
        surgeries: p.surgeries || "",
        medications: p.medications || "",
        allergies: p.allergies || "",
        familyHx: p.family_hx || "",
        obsHx: p.obs_hx || "",
        labRem: p.lab_rem || "",
        labDate: p.lab_date || "",
        labPend: p.lab_pend || "",
        payStatus: p.pay_status || "Pending",
        currency: p.currency || "ETB",
        totalAmt: p.total_amt?.toString() || "",
        paidAmt: p.paid_amt?.toString() || "",
        payMethod: p.pay_method || "",
        insurance: p.insurance || "",
        payRem: p.pay_rem || "",
        regDate: p.reg_date ? p.reg_date.split("T")[0] : "",
        fu1: { date: p.fu1?.date || "", note: p.fu1?.note || "" },
        fu2: { date: p.fu2?.date || "", note: p.fu2?.note || "" },
        fu3: { date: p.fu3?.date || "", note: p.fu3?.note || "" },
        fu4: { date: p.fu4?.date || "", note: p.fu4?.note || "" },
      });
      setLoading(false);
    }
    fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <div className="card">
        <div className="card-title">Loading Patient Profile...</div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="card">
        <div className="card-title">Patient Not Found</div>
        <div className="no-results">
          No patient record matches this identifier.
        </div>
      </div>
    );
  }

  return <PatientForm id={id} initialData={initialData} />;
}
