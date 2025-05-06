
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName, company } = await req.json();
    
    // Validate required fields
    if (!email || !firstName) {
      return new Response(
        JSON.stringify({ success: false, error: "Email and first name are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Customer.io API request
    const response = await fetch("https://track.customer.io/api/v1/customers", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(Deno.env.get("CUSTOMERIO_SITE_ID") + ":" + Deno.env.get("CUSTOMERIO_API_KEY"))}`,
      },
      body: JSON.stringify({
        id: email, // Using email as the customer identifier
        email: email,
        first_name: firstName,
        last_name: lastName || "",
        company: company || "",
        created_at: Math.floor(Date.now() / 1000),
        source: "ROI calculator",
        subscribed: true
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Customer.io API error:", errorText);
      throw new Error(`Customer.io API error: ${response.status}`);
    }

    // Log success
    console.log("Successfully submitted to Customer.io");

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error submitting to Customer.io:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
