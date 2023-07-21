import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    order?: number;
    icon: string;
  }
}
