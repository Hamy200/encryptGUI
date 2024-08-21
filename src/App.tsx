import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeProvider } from "@/components/theme-provider"
import Encrypt from "@/components/Encrypt"
import Decrypt from "@/components/Decrypt"

export default function App() {


  return (

    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="mt-10 gap-5 flex flex-col justify-center items-center">
        <h1 className="font-extrabold text-4xl">Welcome to GPG Encrypt/Decrypt GUI</h1>

        <Tabs defaultValue="encrypt" className="flex flex-col w-1/2">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
            <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
          </TabsList>
          <TabsContent value="encrypt">
            <Encrypt/>
          </TabsContent>
          <TabsContent value="decrypt">
            <Decrypt/>
          </TabsContent>
        </Tabs>
      </div>
    </ThemeProvider>


  )
}


