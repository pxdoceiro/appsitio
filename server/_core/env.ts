export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  forgeModel:
    process.env.BUILT_IN_FORGE_MODEL ??
    process.env.OPENROUTER_MODEL ??
    "",
  sttApiUrl:
    process.env.STT_API_URL ??
    process.env.BUILT_IN_FORGE_API_URL ??
    "",
  sttApiKey:
    process.env.STT_API_KEY ??
    process.env.BUILT_IN_FORGE_API_KEY ??
    "",
  sttModel: process.env.STT_MODEL ?? "whisper-1",
};
