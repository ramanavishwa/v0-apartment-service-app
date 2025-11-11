import Image from "next/image"

export function LogoHeader() {
  return (
    <div className="flex items-center gap-3">
      <Image src="/fix-nexus-logo.png" alt="Fix Nexus" width={40} height={40} className="h-10 w-auto" />
      <h1 className="text-xl font-bold text-primary">Fix Nexus</h1>
    </div>
  )
}
