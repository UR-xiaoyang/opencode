import { ConfigDiff } from "../config/diff"

const encoder = new TextEncoder()

export type DiffLike = {
  readonly file?: string
  readonly patch?: string
  readonly additions: number
  readonly deletions: number
  readonly status?: "added" | "deleted" | "modified"
}

export interface TruncateDiffOptions {
  maxFiles?: number
  maxPatchBytes?: number
}

export interface TruncateDiffResult<T extends DiffLike> {
  diffs: T[]
  truncated: {
    files: boolean
    patches: number
    patchFiles: string[]
    totalFiles: number
  }
}

/**
 * Truncate diffs to prevent UI freezing with large changesets.
 *
 * Applies two limits:
 * - `maxFiles`: Maximum number of file diffs to return (default: 1000)
 * - `maxPatchBytes`: Maximum size for a single file patch in bytes (default: 100KB)
 *
 * When a patch exceeds `maxPatchBytes`, it is replaced with a truncation notice.
 */
export function truncateDiffs<T extends DiffLike>(
  diffs: readonly T[],
  options: TruncateDiffOptions = {},
): TruncateDiffResult<T> {
  const maxFiles = options.maxFiles ?? ConfigDiff.DEFAULT_MAX_FILES
  const maxPatchBytes = options.maxPatchBytes ?? ConfigDiff.DEFAULT_MAX_PATCH_BYTES

  const totalFiles = diffs.length
  const truncatedFiles = totalFiles > maxFiles
  const selectedDiffs = truncatedFiles ? diffs.slice(0, maxFiles) : diffs

  let truncatedPatches = 0
  const truncatedPatchFiles: string[] = []
  const processedDiffs = selectedDiffs.map((diff) => {
    if (!diff.patch) return diff

    const patchBytes = encoder.encode(diff.patch).byteLength
    if (patchBytes <= maxPatchBytes) return diff

    truncatedPatches++
    if (diff.file) truncatedPatchFiles.push(diff.file)
    const truncationNotice = `[Patch truncated: ${formatBytes(patchBytes)} exceeds ${formatBytes(maxPatchBytes)} limit]\n\nThis file has too many changes to render safely. To review:\n- View the file directly\n- Use git diff on the command line\n- Increase diff.max_patch_bytes in your config`

    return {
      ...diff,
      patch: truncationNotice,
    } as T
  })

  return {
    diffs: processedDiffs,
    truncated: {
      files: truncatedFiles,
      patches: truncatedPatches,
      patchFiles: truncatedPatchFiles,
      totalFiles,
    },
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
