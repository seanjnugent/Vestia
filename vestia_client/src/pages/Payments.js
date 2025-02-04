import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import PaymentsTable from "../components/payments/PaymentsTable";
import InstructionsTable from "../components/payments/InstructionsTable";

const Payments = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [oneOffPayments, setOneOffPayments] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [currentPaymentsPage, setCurrentPaymentsPage] = useState(1);
  const [currentInstructionsPage, setCurrentInstructionsPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchPayments = useCallback(async () => {
    const storedClientId = localStorage.getItem("userId");
    if (!storedClientId) {
      setError("Client ID is missing");
      setIsLoading(false);
      return;
    }

    try {
      const paymentsResponse = await fetch(
        `http://localhost:5000/api/payments/getClientPayments/${storedClientId}`
      );
      const instructionsResponse = await fetch(
        `http://localhost:5000/api/payments/getClientInstructions/${storedClientId}`
      );

      if (!paymentsResponse.ok || !instructionsResponse.ok) {
        throw new Error(
          `HTTP error! status: ${paymentsResponse.status}, ${instructionsResponse.status}`
        );
      }

      const paymentsData = await paymentsResponse.json();
      const instructionsData = await instructionsResponse.json();

      setOneOffPayments(Array.isArray(paymentsData) ? paymentsData : []);
      setInstructions(Array.isArray(instructionsData) ? instructionsData : []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchPayments();
  }, [fetchPayments]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const parsedDate = parseISO(dateString);
      return format(parsedDate, "dd MMM yyyy");
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatAmount = (amount) => {
    if (amount == null) return "N/A";
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Math.abs(amount));
    } catch (error) {
      return "Invalid Amount";
    }
  };

  const getPaymentType = (amount) => (amount >= 0 ? "Deposit" : "Withdrawal");

  // Pagination logic for payments
  const indexOfLastPayment = currentPaymentsPage * itemsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - itemsPerPage;
  const currentPayments = oneOffPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );

  // Pagination logic for instructions
  const indexOfLastInstruction = currentInstructionsPage * itemsPerPage;
  const indexOfFirstInstruction = indexOfLastInstruction - itemsPerPage;
  const currentInstructions = instructions.slice(
    indexOfFirstInstruction,
    indexOfLastInstruction
  );

  const paginatePayments = (pageNumber) => setCurrentPaymentsPage(pageNumber);
  const paginateInstructions = (pageNumber) =>
    setCurrentInstructionsPage(pageNumber);

  const renderPaginationButtons = (totalItems, currentPage, paginate) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
      pageNumbers.push(i);
    }

    if (pageNumbers.length <= 1) return null; // Don't render pagination if there's only one page

    return (
      <nav className="flex justify-center mt-4">
        <ul className="inline-flex space-x-1">
          {pageNumbers.map((number) => (
            <li key={number}>
              <button
                onClick={() => paginate(number)}
                className={`px-3 py-1 rounded ${
                  currentPage === number
                    ? "bg-primary text-white"
                    : "bg-white text-primary border border-primary"
                }`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full lg:w-3/4 p-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            <PaymentsTable
              currentPayments={currentPayments}
              formatDate={formatDate}
              getPaymentType={getPaymentType}
              formatAmount={formatAmount}
              oneOffPayments={oneOffPayments}
              currentPaymentsPage={currentPaymentsPage}
              paginatePayments={paginatePayments}
              renderPaginationButtons={renderPaginationButtons}
            />
            <InstructionsTable
              currentInstructions={currentInstructions}
              formatDate={formatDate}
              formatAmount={formatAmount}
              instructions={instructions}
              currentInstructionsPage={currentInstructionsPage}
              paginateInstructions={paginateInstructions}
              renderPaginationButtons={renderPaginationButtons}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
