'use client';

import { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/Card';
import { Button } from '@/components/ui/shadcn/Button';
import { Separator } from '@/components/ui/shadcn/Separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/shadcn/Dialog';
import FileListData from '@/components/modules/FileListData';
import UserData from '@/components/modules/UserData';
import UserSkeleton from '@/components/ui/UserSkeleton';
import FileTreeSkeleton from '@/components/ui/FileTreeSkeleton';

export default function FileMain({ token }: { token: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <Card className="w-[550px]">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Suspense fallback={<UserSkeleton />}>
                <UserData token={token} />
              </Suspense>
              <Button className="ml-auto" variant="secondary" onClick={() => setDialogOpen(true)}>
                Indexar archivos
              </Button>
              <Button className="ml-auto">Cerrar sesion</Button>
            </div>
          </CardTitle>
          <Separator />
        </CardHeader>
        <CardContent className="min-h-[200px]"></CardContent>
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Archivos disponibles</DialogTitle>
            <Suspense fallback={<FileTreeSkeleton />}>
              {dialogOpen && <FileListData token={token} />}
            </Suspense>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
