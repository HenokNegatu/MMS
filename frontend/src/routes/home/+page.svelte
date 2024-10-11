<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import {
		Bell,
		ChevronRight,
		Download,
		File,
		Folder,
		Home,
		Library,
		Music,
		PlayCircle,
		Search,
		Settings,
		Upload,
		User,
		Video
	} from 'lucide-svelte';

	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="">
	<nav class="mb-6 flex items-center space-x-2">
		<h1 class="text-lg font-bold">Minimal Media Server</h1>
	</nav>


   <Card.Root class="m-5">
      <Card.Header>
         <div class="flex justify-between items-center">
           <Card.Title>File Browser</Card.Title>
           <Button variant="outline" size="sm">
             <Upload class="h-4 w-4 mr-2" />
             Upload
           </Button>
         </div>
         
       </Card.Header>
      <Card.Content class="m-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
         {#each data.data as file}
			<Card.Root class="hover:bg-accent transition-colors">
				<Card.Content class="flex flex-col items-center p-4 text-center">
					{#if file.type === 'folder'}
						<Folder class="h-6 w-6" />
					{:else if file.type === 'mp4' || file.type === 'webm' || file.type === 'mov' || file.type === 'mkv' || file.type === 'avi'}
						<Video class="h-6 w-6" />
					{:else if file.type === 'audio'}
						<Music class="h-6 w-6" />
					{:else}
						<File class="h-6 w-6" />
					{/if}
					<h3 class="mt-2 w-full truncate text-sm font-medium">{file.name}</h3>
					<p class="text-muted-foreground mt-1 text-xs">
						{(() => {
							if (file.size === 0) {
								return '0 bytes';
							} else if (file.size < 1024) {
								return `${file.size} bytes`;
							} else if (file.size < 1024 * 1024) {
								return `${Math.round(file.size / 1024)} KB`;
							} else if (file.size < 1024 * 1024 * 1024) {
								return `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
							} else {
								return `${(file.size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
							}
						})()}
					</p>
					{#if file.type !== 'folder'}
							<Tooltip.Root>
								<Tooltip.Trigger>
									{#if file.type === 'folder'}
										<Button><Folder className="h-4 w-4" /></Button>
									{:else}
										<form action="" method="get">
											<input type="hidden" name="id" value={file.id} />
											<Button variant="ghost" class="m-2"><Download className="h-4 w-4" /></Button>
										</form>
									{/if}
								</Tooltip.Trigger>
								<Tooltip.Content>
									<p>Download {file.name}</p>
								</Tooltip.Content>
							</Tooltip.Root>
						
					{/if}
				</Card.Content>
			</Card.Root>
		{/each}
      </Card.Content>
    </Card.Root>

</div>
