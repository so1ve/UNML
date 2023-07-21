import { API_VAR } from "@unml/constants";

export function handleExtensions() {
  const client = useClient();
  window[API_VAR].onCallClientCommand(client.callClientCommand);
}
