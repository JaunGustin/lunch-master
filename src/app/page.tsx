import { TicketBooklet } from "@/components/TicketBooklet";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center gap-10 px-4 py-12">
      <h1 className="font-mono text-xl text-foreground">Tiquetera</h1>

      <div className="flex w-full max-w-4xl flex-col items-center gap-10 md:flex-row md:items-start md:justify-center">
        <TicketBooklet
          title="Almuerzos"
          costLabel="Costo: 255.000 COP (30 unds)"
          storageKey="tiquetera-almuerzos"
          quickAmounts={[1, 2, 3, 4, 5]}
          allowUndo
          color="amber"
        />
        <TicketBooklet
          title="Domicilios"
          costLabel="Costo: 150.000 COP el domicilio al mes (30 unds)"
          storageKey="tiquetera-domicilios"
          quickAmounts={[1, 2, 3, 4, 5]}
          allowUndo
          color="teal"
        />
      </div>
    </div>
  );
}
