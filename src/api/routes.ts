/**
 * Central API route definitions.
 * Use with dot notation: ApiRoutes.auth.login, ApiRoutes.auth.onboarding.sendOtp, etc.
 */

const base = '/api';

export const ApiRoutes = {
  auth: {
    login: `${base}/auth/login`,
    me: `${base}/auth/me`,
    profile: `${base}/auth/profile`,
    addRole: `${base}/auth/add-role`,
    sendEmailOtp: `${base}/auth/send-email-otp`,
    verifyEmailOtp: `${base}/auth/verify-email-otp`,
    resendEmailOtp: `${base}/auth/resend-email-otp`,
    onboarding: {
      sendOtp: `${base}/auth/onboarding/send-otp`,
      verifyOtp: `${base}/auth/onboarding/verify-otp`,
    },
  },
  roles: {
    switch: `${base}/roles/switch`,
    list: `${base}/roles`,
    add: `${base}/roles/add`,
    remove: (role: string) => `${base}/roles/${role}`,
  },
  profile: {
    get: `${base}/profile`,
    updateUser: `${base}/profile/user`,
    updateDoctor: `${base}/profile/doctor`,
    updateClinic: `${base}/profile/clinic`,
    updateFactory: `${base}/profile/factory`,
    uploadImage: `${base}/profile/upload-image`,
    addresses: `${base}/profile/addresses`,
  },
  doctors: {
    list: `${base}/doctors`,
    create: `${base}/doctors`,
    byId: (id: string) => `${base}/doctors/${id}`,
    profile: `${base}/doctors/profile/me`,
    appointments: `${base}/doctors/appointments/me`,
    payments: `${base}/doctors/payments/me`,
    patients: `${base}/doctors/patients/me`,
    schedule: `${base}/doctors/schedule`,
  },
  clinics: {
    profile: `${base}/clinics/profile`,
    create: `${base}/clinics`,
    products: `${base}/clinics/products`,
    productById: (id: string) => `${base}/clinics/products/${id}`,
    orders: `${base}/clinics/orders`,
    expenses: `${base}/clinics/expenses`,
    inventory: `${base}/clinics/inventory`,
    factories: `${base}/clinics/factories`,
  },
  factories: {
    profile: `${base}/factories/profile`,
    create: `${base}/factories`,
    products: `${base}/factories/products`,
    productById: (id: string) => `${base}/factories/products/${id}`,
    clients: `${base}/factories/clients`,
    clientById: (id: string) => `${base}/factories/clients/${id}`,
    orders: `${base}/factories/orders`,
    orderById: (id: string) => `${base}/factories/orders/${id}`,
    payments: `${base}/factories/payments`,
    shipping: `${base}/factories/shipping`,
  },
  users: {
    profile: `${base}/users/profile`,
    cart: `${base}/users/cart`,
    orders: `${base}/users/orders`,
  },
  appointments: {
    create: `${base}/appointments`,
    list: `${base}/appointments`,
    status: (id: string) => `${base}/appointments/${id}/status`,
  },
  medicines: {
    list: `${base}/medicines`,
    byId: (id: string) => `${base}/medicines/${id}`,
  },
  labTests: {
    list: `${base}/lab-tests`,
    byId: (id: string) => `${base}/lab-tests/${id}`,
  },
  orders: {
    byId: (id: string) => `${base}/orders/${id}`,
    status: (id: string) => `${base}/orders/${id}/status`,
  },
  chat: {
    list: `${base}/chat/list`,
    byReceiver: (receiverId: string) => `${base}/chat/${receiverId}`,
    messages: (receiverId: string) => `${base}/chat/${receiverId}/messages`,
    send: `${base}/chat/send`,
  },
  schedules: {
    byDoctor: (doctorId: string) => `${base}/schedules/doctor/${doctorId}`,
    availableSlots: `${base}/schedules/available-slots`,
  },
  categories: {
    list: `${base}/categories`,
    bySlug: (slug: string) => `${base}/categories/${slug}`,
  },
  search: {
    query: `${base}/search`,
  },
  banners: {
    list: `${base}/banners`,
    click: (id: string) => `${base}/banners/${id}/click`,
  },
  payments: {
    list: `${base}/payments`,
  },
  notifications: {
    list: `${base}/notifications`,
    read: (id: string) => `${base}/notifications/${id}/read`,
    readAll: `${base}/notifications/read-all`,
  },
  settings: {
    get: `${base}/settings`,
    update: `${base}/settings`,
  },
} as const;
