const STORAGE_KEY = "bahrain_nursing_requests";

export const getRequests = () => {
  const storedRequests = localStorage.getItem(STORAGE_KEY);

  if (!storedRequests) {
    return [];
  }

  try {
    return JSON.parse(storedRequests);
  } catch {
    return [];
  }
};

export const saveRequests = (requests) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(requests)
  );
};

export const addRequest = (request) => {
  const requests = getRequests();

  const newRequest = {
    ...request,
    id: `REQ-${Date.now()}`,
    status: "Pending Verification",
    createdAt: new Date().toISOString(),

    // Feedback system
    feedbackRequested: false,
    feedbackSubmitted: false,
    feedback: null,
  };

  saveRequests([
    ...requests,
    newRequest,
  ]);

  return newRequest;
};

export const updateRequestStatus = (
  requestId,
  status
) => {
  const requests = getRequests();

  const updatedRequests = requests.map((request) =>
    request.id === requestId
      ? {
          ...request,
          status,
        }
      : request
  );

  saveRequests(updatedRequests);

  return updatedRequests;
};

// Request feedback from user
export const requestFeedback = (requestId) => {
  const requests = getRequests();

  const updatedRequests = requests.map((request) =>
    request.id === requestId
      ? {
          ...request,
          feedbackRequested: true,
          feedbackSubmitted: false,
        }
      : request
  );

  saveRequests(updatedRequests);

  return updatedRequests;
};

// Save user feedback
export const submitFeedback = (
  requestId,
  feedbackData
) => {
  const requests = getRequests();

  const updatedRequests = requests.map((request) =>
    request.id === requestId
      ? {
          ...request,
          feedbackSubmitted: true,
          feedbackRequested: true,
          feedback: {
            ...feedbackData,
            submittedAt: new Date().toISOString(),
          },
        }
      : request
  );

  saveRequests(updatedRequests);

  return updatedRequests;
};

export const getLatestRequest = () => {
  const requests = getRequests();

  if (requests.length === 0) {
    return null;
  }

  return requests[requests.length - 1];
};