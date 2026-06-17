import React from "react";
import { render, screen } from "@testing-library/react";
import { NavigationDock } from "../../../components/navigation-dock";
import { useSession } from "next-auth/react";

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("NavigationDock - Visibilidade do Controle de Usuários", () => {
  it("nao deve exibir a opcao de usuarios para contadores", () => {
    (useSession as any).mockReturnValue({
      data: { user: { name: "Contador Teste", role: "accountant" } },
      status: "authenticated",
    });

    render(<NavigationDock activePage="dashboard" />);
    const linkElement = screen.queryByText("Controle de Usuários");
    expect(linkElement).toBeNull();
  });

  it("deve exibir a opcao de usuarios para administradores", () => {
    (useSession as any).mockReturnValue({
      data: { user: { name: "Admin Teste", role: "admin" } },
      status: "authenticated",
    });

    render(<NavigationDock activePage="dashboard" />);
    const linkElement = screen.getByText("Controle de Usuários");
    expect(linkElement).toBeInTheDocument();
  });
});
