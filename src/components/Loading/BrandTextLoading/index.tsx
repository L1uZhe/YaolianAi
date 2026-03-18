import { BrandLoading, LobeHubText } from '@lobehub/ui/brand';

import { isCustomBranding } from '@/const/version';

import CircleLoading from '../CircleLoading';
import styles from './index.module.css';

interface BrandTextLoadingProps {
  debugId: string;
}

const BrandTextLoading = ({ debugId }: BrandTextLoadingProps) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
      animation: 'fadeIn 0.3s ease-in'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      <span style={{ fontSize: '16px', color: '#999' }}>Loading</span>
    </div>
  );
};

export default BrandTextLoading;
